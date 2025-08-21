/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface TranslateTextRequest {
  locale: TranslateTextRequestLocale;
  type?: string;
  text: string;
}

export interface TranslateTextRequestLocale {
  from: string;
  to: string;
}

export interface TranslateTextResponse {
  translation: string;
}
