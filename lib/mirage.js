/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var restler = require("restler");


var DEFAULT_REST_HOST = "https://api.mirage-ai.com";
var DEFAULT_REST_BASE = "/v1";
var DEFAULT_TIMEOUT   = 40000;

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
 * @param  {string} resource
 * @param  {object} data
 * @return {object} Promise object
 */
Mirage.prototype._post = function(resource, data) {
  var self = this;

  data = (data || {});

  return new Promise(function(resolve, reject) {
    self.__doPost(
      resource, data, resolve, reject
    );
  });
};


/**
 * Mirage.prototype.__doPost
 * @protected
 * @param  {string}   resource
 * @param  {object}   data
 * @param  {function} resolve
 * @param  {function} reject
 * @return {object}   Promise object
 */
Mirage.prototype.__doPost = function(resource, data, resolve, reject) {
  restler.postJson(this.__getRESTURL(resource), data, {
    username           : this.__auth.username,
    password           : this.__auth.password,
    timeout            : this.__network.timeout,

    rejectUnauthorized : true,

    headers            : {
      "User-Agent" : this.__useragent
    }
  })
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
        reason  : ((error.error || {}).reason || "error"),
        message : ((error.error || {}).message || "Unknown error reason.")
      });
    });
};


/**
 * Mirage.prototype.__getRESTURL
 * @private
 * @param  {string} resource
 * @return {string} REST URL
 */
Mirage.prototype.__getRESTURL = function(resource) {
  return (this.__rest.host + this.__rest.base + resource);
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
