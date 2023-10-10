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
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.TranscribeSpeech = function(data, options) {
  return this.parent._post("/task/transcribe/speech", data, options);
};


/**
 * Task.prototype.AnswerQuestion
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.AnswerQuestion = function(data, options) {
  return this.parent._post("/task/answer/question", data, options);
};


/**
 * Task.prototype.SummarizeParagraphs
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.SummarizeParagraphs = function(data, options) {
  return this.parent._post("/task/summarize/paragraphs", data, options);
};


/**
 * Task.prototype.SummarizeConversation
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.SummarizeConversation = function(data, options) {
  return this.parent._post("/task/summarize/conversation", data, options);
};


/**
 * Task.prototype.CategorizeConversation
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.CategorizeConversation = function(data, options) {
  return this.parent._post("/task/categorize/conversation", data, options);
};


/**
 * Task.prototype.RankQuestion
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.RankQuestion = function(data, options) {
  return this.parent._post("/task/rank/question", data, options);
};


/**
 * Task.prototype.TranslateText
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.TranslateText = function(data, options) {
  return this.parent._post("/task/translate/text", data, options);
};


exports.default = Task;
