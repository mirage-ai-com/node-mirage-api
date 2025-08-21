/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * TYPES
 ***************************************************************************/

export interface CategorizeConversationsRequest {
  conversations: CategorizeConversationsRequestConversation[];
}

export interface CategorizeConversationsRequestConversation {
  transcript: CategorizeConversationsRequestConversationTranscript[];
}

export interface CategorizeConversationsRequestConversationTranscript {
  from: string;
  text: string;
}

export interface CategorizeQuestionRequest {
  question: string;
}

export interface CategorizeConversationsResponse {
  categories: string[];
}

export interface CategorizeQuestionResponse {
  category: string;
}
