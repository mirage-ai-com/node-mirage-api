/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface EmbeddingTextsRequest {
  texts: string[];
  instruction?: string;
}

export interface EmbeddingTextsResponse {
  embeddings: number[][];
}
