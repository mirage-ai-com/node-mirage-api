/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var events  = require("events");
var restler = require("restler");


var DEFAULT_REST_HOST = "https://api.mirage-ai.com";
var DEFAULT_REST_BASE = "/v1";
var DEFAULT_TIMEOUT   = 40000;

var STREAM_EVENT_PREFIX        = "event:";
var STREAM_DATA_PREFIX         = "data:";
var STREAM_START_TAG           = "[START]";
var STREAM_DONE_TAG            = "[DONE]";
var STREAM_CHUNK_STALL_TIMEOUT = 10000;

var STREAM_RESERVED_EVENTS     = [
  "start",
  "done",
  "error",
  "end"
];

var RESOURCES = [
  "Task",
  "Data"
];


/**
 * Mirage
 * @class
 * @classdesc  Instanciates a new Mirage connector.
 * @param      {string} userID
 * @param      {string} secretKey
 * @param      {object} [options]
 */
var Mirage = function(userID, secretKey, options) {
  options = (options || {});

  // Sanitize options
  if (typeof userID !== "string" || !userID) {
    throw new Error("Invalid or missing userID");
  }
  if (typeof secretKey !== "string" || !secretKey) {
    throw new Error("Invalid or missing secretKey");
  }

  // Prepare storage
  this.__auth = {
    username : userID,
    password : secretKey
  };

  this.__rest = {
    host : (options.rest_host || DEFAULT_REST_HOST),
    base : (options.rest_base || DEFAULT_REST_BASE)
  };

  this.__network = {
    timeout : (options.timeout || DEFAULT_TIMEOUT)
  };

  // Initialize HTTP agents
  var _http = (
    (this.__rest.host.startsWith("https:") === true) ?
      require("https") : require("http")
  );

  this.__agents = {
    data   : new _http.Agent({
      keepAlive : true,
      timeout   : (options.timeout || DEFAULT_TIMEOUT)
    }),

    stream : new _http.Agent({
      keepAlive : false,
      timeout   : (options.timeout || DEFAULT_TIMEOUT)
    }),
  };

  // Parse package
  var _package = require(__dirname + "/../package.json");

  this.__useragent = ("node-" + _package.name + "/" + _package.version);

  // Import resources
  this.__importResources();
};


/**
 * Mirage.prototype._post
 * @protected
 * @param  {string} resource
 * @param  {object} [data]
 * @param  {object} [options]
 * @return {object} Promise object
 */
Mirage.prototype._post = function(resource, data, options) {
  var self = this;

  data    = (data    || {});
  options = (options || {});

  return new Promise(function(resolve, reject) {
    var fnPost = (
      (options.stream === true) ? self.__doPostStream : self.__doPostData
    );

    fnPost.bind(self)(resource, data, options, resolve, reject);
  });
};


/**
 * Mirage.prototype.__doPostData
 * @protected
 * @param  {string}   resource
 * @param  {object}   data
 * @param  {object}   options
 * @param  {function} resolve
 * @param  {function} reject
 * @return {object}   Promise object
 */
Mirage.prototype.__doPostData = function(
  resource, data, options, resolve, reject
) {
  restler.postJson(
    this.__getRESTURL(resource), data, this.__getRequestOptions(options.trace)
  )
    .on("success", function(data) {
      if (data && data.data) {
        return resolve(data.data);
      }

      return resolve({});
    })
    .on("error", function(error) {
      return reject({
        reason  : "error",
        message : (error || "Request could not be submitted.")
      });
    })
    .on("timeout", function() {
      return reject({
        reason  : "timed_out",
        message : "The request processing took too much time."
      });
    })
    .on("fail", function(error, response) {
      return reject({
        reason  : ((error.error || {}).reason  || "error"),
        message : ((error.error || {}).message || "Unknown error reason.")
      });
    });
};


/**
 * Mirage.prototype.__doPostStream
 * @protected
 * @param  {string}   resource
 * @param  {object}   data
 * @param  {object}   options
 * @param  {function} resolve
 * @param  {function} reject
 * @return {object}   Promise object
 */
Mirage.prototype.__doPostStream = function(
  resource, data, options, resolve, reject
) {
  var request = restler.postJson(
    this.__getRESTURL(resource, true), data,
      this.__getRequestOptions(options.trace, true)
  );

  request
    .on("response", function(response) {
      var emitter     = new events.EventEmitter(),
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
      var nextChunkStallTimeout = null;

      var fnCancelNextChunkStall = function() {
        // Clear previous stall timeout? (if any)
        if (nextChunkStallTimeout !== null) {
          clearTimeout(nextChunkStallTimeout);

          nextChunkStallTimeout = null;
        }
      };

      var fnScheduleNextChunkStall = function() {
        // Clear previous stall timeout (as needed)
        fnCancelNextChunkStall();

        // Schedule next stall timeout
        nextChunkStallTimeout = setTimeout(function() {
          // Abort request straight away
          request.abort("Stalled");

          // Clear buffer (we aborted)
          drainBuffer = "";

          // Raise forced stall 'error' + 'end' events
          emitter.emit("error", new Error("Stream stalled"));

          // Process at next event loop tick, as the 'error' event might \
          //   come out-of-order after the 'end' event.
          setImmediate(function() {
            emitter.emit("end");
          });
        }, STREAM_CHUNK_STALL_TIMEOUT);
      };

      // Schedule first chunk stall timeout
      fnScheduleNextChunkStall();

      // Handle data chunks
      response.on("data", function(chunk) {
        // Schedule next chunk stall timeout
        fnScheduleNextChunkStall();

        // Append to drain buffer
        drainBuffer += chunk.toString();

        // Emit fully-assembled data from chunk
        var lineParts = drainBuffer.split("\n");

        // Terminated by new line? Process buffer now
        if ((lineParts.length > 0)  &&
              (lineParts[lineParts.length - 1] === "")) {
          // Clear drain buffer immediately
          drainBuffer = "";

          // Process each data part
          for (var i = 0; i < lineParts.length; i++) {
            var linePart = lineParts[i];

            // Line is empty? Skip it.
            if (linePart.length === 0) {
              // Abort parsing of line there.
              continue;
            }

            // Acquire line type ('event:' or 'data:')
            if (linePart.startsWith(STREAM_DATA_PREFIX) === true) {
              // Clear out tag from text part
              var dataPart = (
                linePart.substring(STREAM_DATA_PREFIX.length).trim()
              );

              // System events are not broadcasted to the user, as those are \
              //   special non-user level events.
              if (eventBlock === "system") {
                if (dataPart === STREAM_START_TAG) {
                  // Process at next event loop tick, as the 'start' event \
                  //   might come out-of-order.
                  setImmediate(function() {
                    // Raise 'start' event
                    emitter.emit("start");
                  });
                } else if (dataPart === STREAM_DONE_TAG) {
                  // Clear previous stall timeout (as needed)
                  fnCancelNextChunkStall();

                  // Process at next event loop tick, as the 'done' event \
                  //   might come out-of-order.
                  setImmediate(function() {
                    // Raise 'done' event
                    emitter.emit("done");
                  });
                }
              } else {
                var dataPartObject = JSON.parse(dataPart);

                // Process at next event loop tick, as the 'data' event might \
                //   come out-of-order.
                setImmediate(function() {
                  // Raise event (fallback to 'data' if no event block)
                  // Important: add prefix if event streamed from Mirage is \
                  //   a reserved event (eg. 'error' becomes ':error').
                  var eventName = (eventBlock || "data");

                  if (STREAM_RESERVED_EVENTS.includes(eventName) === true) {
                    eventName = (":" + eventName);
                  }

                  emitter.emit(eventName, dataPartObject);
                });
              }

              // Abort parsing of line there.
              continue;
            }

            if (linePart.startsWith(STREAM_EVENT_PREFIX) === true) {
              // Clear out tag from text part
              var eventPart = (
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
      response.on("error", function(error) {
        // Clear previous stall timeout (as needed)
        fnCancelNextChunkStall();

        // Clear buffer (we aborted)
        drainBuffer = "";

        // Raise 'error' event
        emitter.emit("error", error);
      });

      response.on("end", function() {
        // Clear previous stall timeout (as needed)
        fnCancelNextChunkStall();

        // Process at next event loop tick, as the last 'data' event might \
        //   come out-of-order after the 'end' event.
        setImmediate(function() {
          // Clear buffer (we are done)
          drainBuffer = "";

          // Raise 'end' event
          emitter.emit("end");
        });
      });

      return resolve(emitter);
    })
    .on("error", function(error) {
      return reject({
        reason  : "error",
        message : (error || "Request could not be streamed.")
      });
    })
    .on("timeout", function() {
      return reject({
        reason  : "timed_out",
        message : "The request streaming took too much time."
      });
    });
};


/**
 * Mirage.prototype.__getRESTURL
 * @private
 * @param  {string}  resource
 * @param  {boolean} [stream]
 * @return {string}  REST URL
 */
Mirage.prototype.__getRESTURL = function(resource, stream) {
  stream = (stream || false);

  var restURL = (this.__rest.host + this.__rest.base + resource);

  // Append stream attribute? (if streaming is requested)
  if (stream === true) {
    restURL += "?stream";
  }

  return restURL;
};


/**
 * Mirage.prototype.__getRequestOptions
 * @private
 * @param  {string}  [trace]
 * @param  {boolean} [stream]
 * @return {object}  Request options
 */
Mirage.prototype.__getRequestOptions = function(trace, stream) {
  trace  = (trace  || null);
  stream = (stream || false);

  // Generate headers
  var headers = {
    "User-Agent" : this.__useragent
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
    username           : this.__auth.username,
    password           : this.__auth.password,
    timeout            : this.__network.timeout,

    headers            : headers,

    rejectUnauthorized : true,

    agent              : (
      (stream === true) ? this.__agents.stream : this.__agents.data
    )
  };
};


/**
 * Mirage.prototype.__importResources
 * @protected
 * @return {undefined}
 */
Mirage.prototype.__importResources = function() {
  for (var i = 0; i < RESOURCES.length; i++) {
    var resource = RESOURCES[i];

    var klass = (
      require("./resources/" + resource.toLowerCase() + ".js").default
    );

    this[resource] = new klass(this);
  }
};


exports.Mirage = Mirage;
