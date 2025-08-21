/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";

import events  from "events";
import restler from "restler";
import http    from "http";
import https   from "https";

import Task from "./resources/task";
import Data from "./resources/data";

const DEFAULT_REST_HOST = "https://api.mirage-ai.com";
const DEFAULT_REST_BASE = "/v1";
const DEFAULT_TIMEOUT   = 40000;

const STREAM_EVENT_PREFIX        = "event:";
const STREAM_DATA_PREFIX         = "data:";
const STREAM_START_TAG           = "[START]";
const STREAM_DONE_TAG            = "[DONE]";
const STREAM_CHUNK_STALL_TIMEOUT = 10000;

const STREAM_RESERVED_EVENTS     = [
  "start",
  "done",
  "error",
  "end"
];

export interface MirageOptions {
  rest_host?: string;
  rest_base?: string;
  timeout?: number;
}

export interface RequestOptionsBase {
  trace?: string;
}

export interface RequestOptions extends RequestOptionsBase {
  stream?: boolean;
}

interface MirageAuth {
  username: string;
  password: string;
}

interface MirageRest {
  host: string;
  base: string;
}

interface MirageNetwork {
  timeout: number;
}

interface MirageAgents {
  data: http.Agent;
  stream: http.Agent;
}

/**
 * Mirage
 */
class Mirage {
  private auth: MirageAuth;
  private rest: MirageRest;
  private network: MirageNetwork;
  private agents: MirageAgents;
  private useragent: string;

  public Task: Task = new Task(this);
  public Data: Data = new Data(this);

  /**
   * Constructor
   * @param userID - The user ID
   * @param secretKey - The secret key
   * @param options - The options
   */
  constructor(userID: string, secretKey: string, options: MirageOptions = {}) {
    options = (options || {});

    // Sanitize options
    if (typeof userID !== "string" || !userID) {
      throw new Error("Invalid or missing userID");
    }

    if (typeof secretKey !== "string" || !secretKey) {
      throw new Error("Invalid or missing secretKey");
    }

    // Prepare storage
    this.auth = {
      username : userID,
      password : secretKey
    };

    this.rest = {
      host : (options.rest_host || DEFAULT_REST_HOST),
      base : (options.rest_base || DEFAULT_REST_BASE)
    };

    this.network = {
      timeout : (options.timeout || DEFAULT_TIMEOUT)
    };

    // Initialize HTTP agents
    const _http = (
      (this.rest.host.startsWith("https:") === true) ?
        https : http
    );

    this.agents = {
      data   : new _http.Agent({
        keepAlive : true,
        timeout   : (options.timeout || DEFAULT_TIMEOUT)
      }),

      stream : new _http.Agent({
        keepAlive : false,
        timeout   : (options.timeout || DEFAULT_TIMEOUT)
      })
    };

    this.useragent = ("node-mirage-api/__PKG_VERSION__");
  }


  /**
   * Post
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public post(resource: string, data: object, options: RequestOptions = {}): Promise<any> {
    data    = (data    || {});
    options = (options || {});

    return new Promise((resolve, reject) => {
      let fnPost = (
        (options.stream === true) ? this.doPostStream : this.doPostData
      );

      fnPost.bind(this)(resource, data, options, resolve, reject);
    });
  }


  /**
  * Post Data
  */
  private doPostData(
    resource: string,
    data: object,
    options: RequestOptions,
    // eslint-disable-next-line no-unused-vars
    resolve: (data: object) => void,
    // eslint-disable-next-line no-unused-vars
    reject: (error: object) => void
  ) {
    restler.postJson(
      this.getRESTURL(resource), data, this.getRequestOptions(options.trace)
    )
      .on("success", (data) => {
        if (data?.data) {
          return resolve(data.data);
        }

        return resolve({});
      })
      .on("error", (error) => {
        return reject({
          reason  : "error",
          message : (error || "Request could not be submitted.")
        });
      })
      .on("timeout", () => {
        return reject({
          reason  : "timed_out",
          message : "The request processing took too much time."
        });
      })
      .on("fail", (error) => {
        return reject({
          reason  : (error?.error?.reason  || "error"),
          message : (error?.error?.message || "Unknown error reason.")
        });
      });
  }


  /**
  * Post Stream
  */
  private doPostStream(
    resource: string,
    data: object,
    options: RequestOptions,
    // eslint-disable-next-line no-unused-vars
    resolve: (data: object) => void,
    // eslint-disable-next-line no-unused-vars
    reject: (error: object) => void
  ) {
    let request = restler.postJson(
      this.getRESTURL(resource, true), data,
        this.getRequestOptions(options.trace, true)
    );

    request
      .on("response", (response) => {
        let emitter   = new events.EventEmitter(),
          drainBuffer = "",
          eventBlock  = "";

        // Response is not successful?
        if (response.statusCode >= 400) {
          return reject({
            reason  : "closed",

            message : (
              "Stream closed, got " + response.statusCode + " error from server."
            )
          });
        }

        // Schedule a data chunk stall timeout
        let nextChunkStallTimeout = null;

        let fnCancelNextChunkStall = () => {
          // Clear previous stall timeout? (if any)
          if (nextChunkStallTimeout !== null) {
            clearTimeout(nextChunkStallTimeout);

            nextChunkStallTimeout = null;
          }
        };

        let fnScheduleNextChunkStall = () => {
          // Clear previous stall timeout (as needed)
          fnCancelNextChunkStall();

          // Schedule next stall timeout
          nextChunkStallTimeout = setTimeout(() => {
            // Abort request straight away
            // @ts-ignore
            request.abort("Stalled");

            // Clear buffer (we aborted)
            drainBuffer = "";

            // Raise forced stall 'error' + 'end' events
            emitter.emit("error", new Error("Stream stalled"));

            // Process at next event loop tick, as the 'error' event might \
            //   come out-of-order after the 'end' event.
            setImmediate(() => {
              emitter.emit("end");
            });
          }, STREAM_CHUNK_STALL_TIMEOUT);
        };

        // Schedule first chunk stall timeout
        fnScheduleNextChunkStall();

        // Handle data chunks
        response.on("data", (chunk) => {
          // Schedule next chunk stall timeout
          fnScheduleNextChunkStall();

          // Append to drain buffer
          drainBuffer += chunk.toString();

          // Emit fully-assembled data from chunk
          let lineParts = drainBuffer.split("\n");

          // Terminated by new line? Process buffer now
          if ((lineParts.length > 0)  &&
                (lineParts[lineParts.length - 1] === "")) {
            // Clear drain buffer immediately
            drainBuffer = "";

            // Process each data part
            for (let i = 0; i < lineParts.length; i++) {
              let linePart = lineParts[i];

              // Line is empty? Skip it.
              if (linePart.length === 0) {
                // Abort parsing of line there.
                continue;
              }

              // Acquire line type ('event:' or 'data:')
              if (linePart.startsWith(STREAM_DATA_PREFIX) === true) {
                // Clear out tag from text part
                let dataPart = (
                  linePart.substring(STREAM_DATA_PREFIX.length).trim()
                );

                // System events are not broadcasted to the user, as those are \
                //   special non-user level events.
                if (eventBlock === "system") {
                  if (dataPart === STREAM_START_TAG) {
                    // Raise 'start' event
                    emitter.emit("start");
                  } else if (dataPart === STREAM_DONE_TAG) {
                    // Clear previous stall timeout (as needed)
                    fnCancelNextChunkStall();

                    // Raise 'done' event
                    emitter.emit("done");
                  }
                } else {
                  let dataPartObject = JSON.parse(dataPart);

                  // Acquire event name
                  // Important: add prefix if event streamed from Mirage is \
                  //   a reserved event (eg. 'error' becomes ':error').
                  let eventName = (eventBlock || "data");

                  if (STREAM_RESERVED_EVENTS.includes(eventName) === true) {
                    eventName = (":" + eventName);
                  }

                  // Raise event (fallback to 'data' if no event block)
                  emitter.emit(eventName, dataPartObject);
                }

                // Abort parsing of line there.
                continue;
              }

              if (linePart.startsWith(STREAM_EVENT_PREFIX) === true) {
                // Clear out tag from text part
                let eventPart = (
                  linePart.substring(STREAM_EVENT_PREFIX.length).trim()
                );

                // Update current event block name (or use none)
                eventBlock = (eventPart || "");

                // Abort parsing of line there.
                continue;
              }
            }
          }
        });

        // Handle other stream events
        response.on("error", (error) => {
          // Clear previous stall timeout (as needed)
          fnCancelNextChunkStall();

          // Clear buffer (we aborted)
          drainBuffer = "";

          // Raise 'error' event
          emitter.emit("error", error);
        });

        response.on("end", () => {
          // Clear previous stall timeout (as needed)
          fnCancelNextChunkStall();

          // Process at next event loop tick, as the last 'data' event might \
          //   come out-of-order after the 'end' event.
          setImmediate(() => {
            // Clear buffer (we are done)
            drainBuffer = "";

            // Raise 'end' event
            emitter.emit("end");
          });
        });

        return resolve(emitter);
      })
      .on("error", (error) => {
        return reject({
          reason  : "error",
          message : (error || "Request could not be streamed.")
        });
      })
      .on("timeout", () => {
        return reject({
          reason  : "timed_out",
          message : "The request streaming took too much time."
        });
      });
  }


  /**
  * Get REST URL
  */
  private getRESTURL(resource: string, stream: boolean = false) {
    stream = (stream || false);

    let restURL = (this.rest.host + this.rest.base + resource);

    // Append stream attribute? (if streaming is requested)
    if (stream === true) {
      restURL += "?stream";
    }

    return restURL;
  }


  /**
  * Get request options
  */
  private getRequestOptions(trace: string = null, stream: boolean = false) {
    trace  = (trace  || null);
    stream = (stream || false);

    // Generate headers
    let headers = {
      "User-Agent" : this.useragent
    };

    if (stream === true) {
      // Disable any form of compression if streaming (we do not want to decode \
      //   any eg. compressed chunk of data)
      headers["Accept-Encoding"] = "identity";
    }

    if (trace !== null) {
      // Stamp request with provided trace identifier (this is optional, but \
      //   can be used to track request flows across Mirage backend systems, for \
      //   debugging purposes)
      headers["X-Request-ID"] = trace;
    }

    return {
      username           : this.auth.username,
      password           : this.auth.password,
      timeout            : this.network.timeout,

      headers            : headers,

      rejectUnauthorized : true,

      agent              : (
        (stream === true) ? this.agents.stream : this.agents.data
      )
    };
  }
}


export default Mirage;

export * from "./types";

export { Mirage };
