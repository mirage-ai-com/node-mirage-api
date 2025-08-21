/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


export interface IngestContextDataRequest {
  items: IngestContextDataRequestItem[];
}

export interface IngestContextDataRequestItem {
  operation: string;
  primary_id: string;
  secondary_id?: string;
  tertiary_id?: string;
  text?: string;
  timestamp?: number;
  source?: string;
  metadata?: Record<string, string>;
}

export interface IngestContextDataResponse {
  imported: boolean;
}
