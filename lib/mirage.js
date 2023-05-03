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

var STREAM_DATA_PREFIX = "data:";
var STREAM_DONE_TAG    = "[DONE]";

var RESOURCES = [
  "Task",
  "Data"
];


/**
 * Mirage
 * @class
 * @classdesc  Instanciates a new Mirage connector.
 * @param      {object} options
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

  // Parse package
  var _package = require(__dirname + "/../package.json");

  this.__useragent = ("node-" + _package.name + "/" + _package.version);

  // Import resources
  this.__importResources();
};


/**
 * Mirage.prototype._post
 * @protected
 * @param  {string}  resource
 * @param  {object}  data
 * @param  {boolean} stream
 * @return {object}  Promise object
 */
Mirage.prototype._post = function(resource, data, stream) {
  var self = this;

  data   = (data   || {});
  stream = (stream || false);

  return new Promise(function(resolve, reject) {
    var fnPost = ((stream === true) ? self.__doPostStream : self.__doPostData);

    fnPost.bind(self)(resource, data, resolve, reject);
  });
};


/**
 * Mirage.prototype.__doPostData
 * @protected
 * @param  {string}   resource
 * @param  {object}   data
 * @param  {function} resolve
 * @param  {function} reject
 * @return {object}   Promise object
 */
Mirage.prototype.__doPostData = function(resource, data, resolve, reject) {
  restler.postJson(
    this.__getRESTURL(resource), data, this.__getRequestOptions()
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
 * @param  {function} resolve
 * @param  {function} reject
 * @return {object}   Promise object
 */
Mirage.prototype.__doPostStream = function(resource, data, resolve, reject) {
  restler.postJson(
    this.__getRESTURL(resource, true), data, this.__getRequestOptions(true)
  )
    .on("response", function(response) {
      var emitter     = new events.EventEmitter(),
          drainBuffer = "";

      // Response is not successful?
      if (response.statusCode >= 400) {
        return reject({
          reason  : "closed",

          message : (
            "Stream closed, got " + response.statusCode + " error from server."
          )
        });
      }

      // Handle data chunks
      response.on("data", function(chunk) {
        // Append to drain buffer
        drainBuffer += chunk.toString();

        // Emit fully-assembled data from chunk
        var dataParts = drainBuffer.split("\n");

        // Terminated by new line? Process buffer now
        if ((dataParts.length > 0)  &&
              (dataParts[dataParts.length - 1] === "")) {
          // Clear drain buffer immediately
          drainBuffer = "";

          // Process each data part
          for (var i = 0; i < dataParts.length; i++) {
            var dataPart = dataParts[i];

            if (dataPart.length > 0  &&
                  dataPart.startsWith(STREAM_DATA_PREFIX) === true) {
              // Clear out tag from data part
              dataPart = dataPart.substring(STREAM_DATA_PREFIX.length).trim();

              if (dataPart === STREAM_DONE_TAG) {
                // Raise 'done' event
                emitter.emit("done");
              } else {
                // Raise 'data' event
                emitter.emit("data", JSON.parse(dataPart));
              }
            }
          }
        }
      });

      // Handle other stream events
      response.on("error", function(error) {
        // Clear buffer (we aborted)
        drainBuffer = "";

        // Raise 'error' event
        emitter.emit("error", error);
      });

      response.on("end", function() {
        // Clear buffer (we are done)
        drainBuffer = "";

        // Raise 'end' event
        emitter.emit("end");
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
 * @param  {boolean} stream
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
 * @param  {boolean} stream
 * @return {object}  Request options
 */
Mirage.prototype.__getRequestOptions = function(stream) {
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

  return {
    username           : this.__auth.username,
    password           : this.__auth.password,
    timeout            : this.__network.timeout,

    headers            : headers,

    rejectUnauthorized : true
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
