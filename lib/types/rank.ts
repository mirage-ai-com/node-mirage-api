/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface RankQuestionRequest {
  question: string;
  context: RankQuestionRequestContext;
}

export interface RankQuestionRequestContext {
  source?: string;
  primary_id: string;
  filters?: RankQuestionRequestContextFilters;
}

export interface RankQuestionRequestContextFilters {
  secondary_id?: RankQuestionRequestContextFiltersFilter;
  tertiary_id?: RankQuestionRequestContextFiltersFilter;
  source?: RankQuestionRequestContextFiltersFilter;
}

export interface RankQuestionRequestContextFiltersFilter {
  include?: string[];
  exclude?: string[];
}

export interface RankQuestionResponse {
  results: RankQuestionResponseResults[];
}

export interface RankQuestionResponseResults {
  id: string;
  score: number;
  grouped_text: string;
  items: RankQuestionResponseResultsItem[];
}

export interface RankQuestionResponseResultsItem {
  source?: string;
  primary_id?: string;
  secondary_id?: string;
  text?: string;
  timestamp?: number;
  metadata?: Record<string, string>;
}

export interface RankQuestionResponse {
  results: RankQuestionResponseResults[];
}
