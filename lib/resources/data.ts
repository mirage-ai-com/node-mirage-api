/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// PROJECT: MAIN
import { RequestOptions } from "@/mirage";

// PROJECT: RESOURCES
import BaseResource from "@/resources/base-resource";

// PROJECT: TYPES
import {
  IngestContextDataRequest,
  IngestContextDataResponse
} from "@/types/ingest";

/**************************************************************************
 * CLASSES
 ***************************************************************************/

/**
 * Data
 */
export default class Data extends BaseResource {
  /**
   * ContextIngest
   */
  public ContextIngest(
    data: IngestContextDataRequest, options?: RequestOptions
  ): Promise<IngestContextDataResponse> {
    return this.parent.post("/data/context/ingest", data, options);
  }
}
