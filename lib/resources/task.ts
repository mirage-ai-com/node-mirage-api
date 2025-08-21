/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// NPM
import { RequestOptions } from "../mirage";

// PROJECT: RESOURCES
import BaseResource from "./base-resource";

// PROJECT: TYPES
import {
  TranscribeSpeechRequest,
  TranscribeSpeechResponse
} from "@/types/transcribe";

import {
  AnswerPromptRequest,
  AnswerPromptResponse,
  AnswerChatRequest,
  AnswerChatResponse,
  AnswerChatResponseStreamable,
  AnswerQuestionRequest,
  AnswerQuestionResponse
} from "@/types/answer";

import {
  SummarizeParagraphsRequest,
  SummarizeGenericResponse,
  SummarizeConversationRequest
} from "@/types/summarize";

import {
  CategorizeConversationsRequest,
  CategorizeConversationsResponse,
  CategorizeQuestionRequest,
  CategorizeQuestionResponse
} from "@/types/categorize";

import {
  RankQuestionRequest,
  RankQuestionResponse
} from "@/types/rank";

import {
  TranslateTextRequest,
  TranslateTextResponse
} from "@/types/translate";

import {
  SpamConversationRequest,
  SpamDocumentRequest,
  SpamGenericResponse
} from "@/types/spam";

import {
  FraudSpamicityRequest,
  FraudSpamicityResponse
} from "@/types/fraud";

/**************************************************************************
 * CLASSES
 ***************************************************************************/

/**
 * Task
 */
export default class Task extends BaseResource {
  /**
   * TranscribeSpeech
   */
  public TranscribeSpeech(
    data: TranscribeSpeechRequest, options?: RequestOptions
  ): Promise<TranscribeSpeechResponse> {
    return this.parent.post("/task/transcribe/speech", data, options);
  }

  /**
   * AnswerPrompt
   */
  AnswerPrompt(
    data: AnswerPromptRequest, options?: RequestOptions
  ): Promise<AnswerPromptResponse> {
    return this.parent.post("/task/answer/prompt", data, options);
  }

  /**
   * AnswerChat
   */
  AnswerChat(
    data: AnswerChatRequest, options?: RequestOptions
  ): Promise<AnswerChatResponse|AnswerChatResponseStreamable> {
    return this.parent.post("/task/answer/chat", data, options);
  }

  /**
   * AnswerQuestion
   */
  AnswerQuestion(
    data: AnswerQuestionRequest, options?: RequestOptions
  ): Promise<AnswerQuestionResponse> {
    return this.parent.post("/task/answer/question", data, options);
  }

  /**
   * SummarizeParagraphs
   */
  SummarizeParagraphs(
    data: SummarizeParagraphsRequest,
    options?: RequestOptions
  ): Promise<SummarizeGenericResponse> {
    return this.parent.post("/task/summarize/paragraphs", data, options);
  }

  /**
   * SummarizeConversation
   */
  SummarizeConversation(
    data: SummarizeConversationRequest,
    options?: RequestOptions
  ): Promise<SummarizeGenericResponse> {
    return this.parent.post("/task/summarize/conversation", data, options);
  }

  /**
   * CategorizeConversations
   */
  CategorizeConversations(
    data: CategorizeConversationsRequest,
    options?: RequestOptions
  ): Promise<CategorizeConversationsResponse> {
    return this.parent.post("/task/categorize/conversations", data, options);
  }

  /**
   * CategorizeQuestion
   */
  CategorizeQuestion(
    data: CategorizeQuestionRequest,
    options?: RequestOptions
  ): Promise<CategorizeQuestionResponse> {
    return this.parent.post("/task/categorize/question", data, options);
  }

  /**
   * RankQuestion
   */
  RankQuestion(
    data: RankQuestionRequest, options?: RequestOptions
  ): Promise<RankQuestionResponse> {
    return this.parent.post("/task/rank/question", data, options);
  }

  /**
   * TranslateText
   */
  TranslateText(
    data: TranslateTextRequest, options?: RequestOptions
  ): Promise<TranslateTextResponse> {
    return this.parent.post("/task/translate/text", data, options);
  }

  /**
   * FraudSpamicity
   */
  FraudSpamicity(
    data: FraudSpamicityRequest, options: RequestOptions
  ): Promise<FraudSpamicityResponse> {
    return this.parent.post("/task/fraud/spamicity", data, options);
  }

  /**
   * SpamConversation
   */
  SpamConversation(
    data: SpamConversationRequest, options?: RequestOptions
  ): Promise<SpamGenericResponse> {
    return this.parent.post("/task/spam/conversation", data, options);
  }

  /**
   * SpamDocument
   */
  SpamDocument(
    data: SpamDocumentRequest, options?: RequestOptions
  ): Promise<SpamGenericResponse> {
    return this.parent.post("/task/spam/document", data, options);
  }
}
