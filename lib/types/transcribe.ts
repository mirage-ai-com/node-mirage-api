/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface TranscribeSpeechRequest {
  locale?: TranscribeSpeechRequestLocale;
  media: TranscribeSpeechRequestMedia;
}

export interface TranscribeSpeechRequestLocale {
  to: string;
}

export interface TranscribeSpeechRequestMedia {
  type?: string;
  url: string;
}

export interface TranscribeSpeechResponse {
  locale: string;
  parts: TranscribeSpeechResponsePart[];
}

export interface TranscribeSpeechResponsePart {
  start: number;
  end: number;
  text: string;
}
