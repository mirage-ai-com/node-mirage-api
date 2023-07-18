/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


/**
 * Data
 * @class
 * @classdesc  Instanciates Data resources.
 * @param      {object} parent
 */
var Data = function(parent) {
  this.parent = parent;
};


/**
 * Data.prototype.ContextIngest
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Data.prototype.ContextIngest = function(data, options) {
  return this.parent._post("/data/context/ingest", data, options);
};


exports.default = Data;
