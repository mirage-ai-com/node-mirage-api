/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */

/**************************************************************************
 * INTERFACES
 ***************************************************************************/

export interface ClusterItemsRequest {
  items: ClusterItemsRequestItem[];
  embedding_prefix?: string;
  distance_threshold?: number;
  split_threshold?: number;
  min_cluster_size?: number;
  suspect_size_threshold?: number;
  suspect_p10_threshold?: number;
}

export interface ClusterItemsRequestItem {
  secondary_id: string;
  text: string;
  text_bag?: string;
}

export interface ClusterItemsResponse {
  clusters: ClusterItemsResponseCluster[];
}

export interface ClusterItemsResponseCluster {
  cluster_uid: string;
  parent_cluster_uid?: string;
  size: number;
  canonical_text: string;
  items: ClusterItemsResponseClusterItem[];
}

export interface ClusterItemsResponseClusterItem {
  secondary_id: string;
  text: string;
  text_bag?: string;
}
