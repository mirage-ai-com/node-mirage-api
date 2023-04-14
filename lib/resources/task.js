/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


/**
 * Task
 * @class
 * @classdesc  Instanciates Task resources.
 * @param      {object} parent
 */
var Task = function(parent) {
  this.parent = parent;
};


/**
 * Task.prototype.TranscribeSpeech
 * @public
 * @param  {object} data
 * @return {object} Promise object
 */
Task.prototype.TranscribeSpeech = function(data) {
  return this.parent._post("/task/transcribe/speech", data);
};


/**
 * Task.prototype.AnswerQuestion
 * @public
 * @param  {object} data
 * @return {object} Promise object
 */
Task.prototype.AnswerQuestion = function(data) {
  return this.parent._post("/task/answer/question", data);
};


exports.default = Task;
