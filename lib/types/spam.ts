/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


export interface SpamConversationRequest {
  sender: SpamConversationRequestSender;
  transcript: SpamConversationRequestTranscript[];
}

export interface SpamConversationRequestSender {
  name?: string;
  email?: string;
}

export interface SpamConversationRequestTranscript {
  from: string;
  origin: string;
  text: string;
}

export interface SpamDocumentRequest {
  name: string;
  domain: string;
  title: string;
  content: string;
}

export interface SpamGenericResponse {
  class: string;
  confidence: number;
  logprob: number;
  scores: SpamGenericResponseScores;
}

export interface SpamGenericResponseScores {
  gibberish?: number;
  marketing?: number;
  regular?: number;
  spam: number;
}
