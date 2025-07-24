import {
  BusinessMetadata,
  NodeType,
  RelationshipName,
  SourceSpecificMetadata,
  TechnicalMetadata,
} from './entities.types';

export interface RequestOptions {
  method: string;
  withCredentials: boolean;
  headers: {
    [key: string]: string;
  };
  crossOrigin: boolean;
}

export interface JWTObject {
  at_hash: string;
  aud: string;
  auth_time: number;
  'cognito:groups': string[];
  'cognito:username': string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  identities: { [key: string]: string }[];
  iss: string;
  jti: string;
  name: string;
  origin_jti: string;
  profile: string;
  sub: string;
  token_use: string;
  'custom:roles'?: string | string[];
}

export interface AuthTokensResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

export interface APIDataSourcesResponse {
  data: {
    getDataSources: APIDataSource[];
  };
}

export interface APIDataSource {
  id: string;
  name: string;
  numberOfTables: number;
}

interface APIAggregationBucket {
  key: string;
  doc_count: string;
}

interface APIAggregation {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets?: APIAggregationBucket[];
}

export interface APIAggregations {
  [key: string]: APIAggregation | string;
}

export interface APITablesCountResponse {
  [key: string]: {
    row_count: string;
  };
}

export interface APIAssetMetadataResponse {
  data: {
    getAssetMetadata: {
      technicalMetadata: TechnicalMetadata;
      sourceSpecificMetadata: SourceSpecificMetadata;
      businessMetadata: BusinessMetadata;
    };
  };
}

export interface APIUpdateAssetMetadataResponse {
  updateAssetMetadata: {
    asset_id: string;
    success: string;
    message: string;
    errorType: null | string;
  };
}

export interface APIAssetColumnUpdate {
  columnName?: string;
  dataType?: string;
  columnsComment?: string;
}

export interface APILineage {
  src_id: string;
  src_name: string;
  src_type: string;
  src_datasource: string;
  src_database?: string | null;
  src_owner?: string | null;
  src_team?: string | null;
  src_critical?: string | null;
  dest_id: string;
  dest_name: string;
  dest_type: string;
  dest_datasource: string;
  dest_database?: string | null;
  dest_owner?: string | null;
  dest_team?: string | null;
  dest_critical?: string | null;
  relation_type: string;
  executed_user?: string | null;
  execution_time?: string | null;
  clone_count?: string | null;
}

export interface APINode {
  _id: string;
  name: string;
  desc: string;
  __typename: NodeType;
}

export interface APIRelatedNode {
  _id: string;
  name: string;
  desc: string;
  __typename: NodeType;
}

export interface APIEdge {
  edgeId: string;
  node: APINode;
  relationship: RelationshipName;
  relatedNode: APIRelatedNode;
}

interface SearchNodesResponse {
  searchNodes: APIEdge[];
}

export interface QueryNodesResponse {
  data: SearchNodesResponse;
}
