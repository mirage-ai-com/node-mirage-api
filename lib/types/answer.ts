/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface AnswerPromptRequest {
  prompt: string;
  answer?: AnswerPromptRequestAnswer;
  schema?: object;
  model?: string;
}

export interface AnswerPromptRequestAnswer {
  max_tokens?: number;
  temperature?: number;
  think?: boolean;
}

export interface AnswerQuestionRequest {
  question: string;
  answer?: AnswerQuestionRequestAnswer;
  locale?: AnswerQuestionRequestLocale;
  context: AnswerQuestionRequestContext;
  model?: string;
}

export interface AnswerQuestionRequestAnswer {
  start?: string;
  system?: string;
  quality?: number;
  max_tokens?: number;
  temperature?: number;
  think?: boolean;
}

export interface AnswerQuestionRequestLocale {
  from: string;
}

export interface AnswerQuestionRequestContext {
  source?: string;
  primary_id: string;
  filters?: AnswerQuestionRequestContextFilters;
  conversation: AnswerQuestionRequestContextConversation;
}

export interface AnswerQuestionRequestContextFilters {
  secondary_id?: AnswerQuestionRequestContextFiltersFilter;
  tertiary_id?: AnswerQuestionRequestContextFiltersFilter;
  source?: AnswerQuestionRequestContextFiltersFilter;
}

export interface AnswerQuestionRequestContextFiltersFilter {
  include?: string[];
  exclude?: string[];
}

export interface AnswerQuestionRequestContextConversation {
  messages: AnswerQuestionRequestContextConversationMessage[];
}

export interface AnswerQuestionRequestContextConversationMessage {
  from: string;
  text: string;
}

export interface AnswerChatRequest {
  schema?: object;
  model?: string;
  context: AnswerChatRequestContext;
  answer?: AnswerChatRequestAnswer;
  tools?: AnswerChatRequestTool[];
  tool_choice?: AnswerChatRequestToolChoice;
}

export interface AnswerChatRequestContext {
  conversation: AnswerChatRequestContextConversation;
}

export interface AnswerChatRequestContextConversation {
  messages: AnswerChatRequestContextConversationMessage[];
}

export interface AnswerChatRequestContextConversationMessage {
  from: string;
  text: string;
  tool_calls?: AnswerChatResponseToolCall[];
  tool_call_id?: string;
}

export interface AnswerChatRequestTool {
  type: string;
  function: AnswerChatRequestToolFunction;
}

export interface AnswerChatRequestToolChoice {
  mode: "auto" | "required";
  tools?: string[];
}

export interface AnswerChatRequestAnswer {
  max_tokens?: number;
  temperature?: number;
  think?: boolean;
}

export interface AnswerChatRequestToolFunction {
  name: string;
  description: string;
  parameters?: object;
}

export interface AnswerPromptResponse {
  answer: string;
  model: string;
  thinking?: string;
}

export interface AnswerQuestionResponse {
  answer: string;
  model: string;
  thinking?: string;
  sources: AnswerQuestionResponseSource[];
}

export interface AnswerQuestionResponseSource {
  source?: string;
  score?: number;
  primary_id: string;
  secondary_id?: string;
  excerpt?: string;
  timestamp?: number;
  metadata?: Record<string, string>;
}

export interface AnswerChatResponse {
  answer: string;
  model: string;
  thinking?: string;
  tool_calls?: AnswerChatResponseToolCall[];
}

export interface AnswerChatResponseChunkAnswer {
  chunk?: string;
  index?: number;
}

export interface AnswerChatResponseStreamable {
  // eslint-disable-next-line no-unused-vars
  on(event: "answer", callback: (data: AnswerChatResponseChunkAnswer) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "thinking", callback: (data: AnswerChatResponseChunkAnswer) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "tool_calls", callback: (data: AnswerChatResponseToolCall[]) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "data", callback: (data: unknown) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "end", callback: () => unknown): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "error", callback: (data: unknown) => void): void;
}

export interface AnswerChatResponseToolCall {
  id?: string;
  function?: AnswerChatResponseToolCallFunction;
}

export interface AnswerChatResponseToolCallFunction {
  name: string;
  arguments?: object;
}
