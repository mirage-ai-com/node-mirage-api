/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export type CategorizeCategory = "opener" | "question" | "statement";
export type CategorizeConversationCategory = string;

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
  categories: CategorizeConversationCategory[];
}

export interface CategorizeQuestionResponse {
  category: CategorizeCategory;
  score: number;
  logprob: number;
  scores: Record<CategorizeCategory, number>;
}
