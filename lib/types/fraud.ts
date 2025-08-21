/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * TYPES
 ***************************************************************************/

export interface FraudSpamicityRequest {
  name: string;
  domain: string;
  email_domain: string;
}

export interface FraudSpamicityResponse {
  fraud: boolean;
  score: number;
}
