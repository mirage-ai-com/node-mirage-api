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
 * Task.prototype.AnswerPrompt
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.AnswerPrompt = function(data, options) {
  return this.parent._post("/task/answer/prompt", data, options);
};


/**
 * Task.prototype.AnswerChat
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.AnswerChat = function(data, options) {
  return this.parent._post("/task/answer/chat", data, options);
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
 * Task.prototype.CategorizeConversations
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.CategorizeConversations = function(data, options) {
  return this.parent._post("/task/categorize/conversations", data, options);
};


/**
 * Task.prototype.CategorizeQuestion
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.CategorizeQuestion = function(data, options) {
  return this.parent._post("/task/categorize/question", data, options);
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


/**
 * Task.prototype.FraudSpamicity
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.FraudSpamicity = function(data, options) {
  return this.parent._post("/task/fraud/spamicity", data, options);
};


/**
 * Task.prototype.SpamConversation
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.SpamConversation = function(data, options) {
  return this.parent._post("/task/spam/conversation", data, options);
};


/**
 * Task.prototype.SpamDocument
 * @public
 * @param  {object} data
 * @param  {object} [options]
 * @return {object} Promise object
 */
Task.prototype.SpamDocument = function(data, options) {
  return this.parent._post("/task/spam/document", data, options);
};


exports.default = Task;
