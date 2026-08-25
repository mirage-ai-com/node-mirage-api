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

export interface TranscribeSpeechResponseStreamable {
  // eslint-disable-next-line no-unused-vars
  abort(reason?: string): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "locale", callback: (data: string) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "part", callback: (data: TranscribeSpeechResponsePart) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "data", callback: (data: unknown) => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "start", callback: () => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "done", callback: () => void): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "end", callback: () => unknown): void;
  // eslint-disable-next-line no-unused-vars
  on(event: "error", callback: (data: unknown) => void): void;
}
