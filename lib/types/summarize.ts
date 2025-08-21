/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface SummarizeParagraphsRequest {
  locale?: SummarizeParagraphsRequestLocale;
  paragraphs: SummarizeParagraphsRequestParagraph[];
}

export interface SummarizeParagraphsRequestLocale {
  to: string;
}

export interface SummarizeParagraphsRequestParagraph {
  text: string;
}

export interface SummarizeConversationRequest {
  locale?: SummarizeConversationRequestLocale;
  transcript: SummarizeConversationRequestTranscript[];
}

export interface SummarizeConversationRequestLocale {
  to: string;
}

export interface SummarizeConversationRequestTranscript {
  name: string;
  text: string;
}

export interface SummarizeGenericResponse {
  summary: string;
}
