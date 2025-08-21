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
import Mirage from "@/mirage";

/**************************************************************************
 * CLASSES
 ***************************************************************************/

/**
 * BaseResource
 */
export default class BaseResource {
  public parent: Mirage;

  /**
   * Constructor
   * @param parent - The parent Mirage instance
   */
  constructor(parent: Mirage) {
    this.parent = parent;
  }
}
