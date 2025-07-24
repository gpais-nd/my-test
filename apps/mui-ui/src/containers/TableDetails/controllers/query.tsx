import { gql } from '@apollo/client';
import { getCustomQueryForDetailsPage } from '../../../config/dataSources.config';

export const GET_ASSET_METADATA = (dataSourceName: string, assetId: string) => {
  return gql`
  {
    getAssetMetadata(
      asset_id: "${assetId}"
    ) {
      technicalMetadata {
        created_time
        created_by
        asset_status
        asset_type
        asset_age
        env
        usageMetadata {
          last_altered
          last_altered_age
          last_altered_by
          last_accessed
          last_accessed_age
          last_altered_partition
        }
        operationalMetadata {
          table_size
          vcs
          act_monthly_storage_cost
          asset_size
          asset_daily_cost
        }
        securityAndComplianceMetadata {
          data_sensitivity
          data_classification
          region
          sub_region
          child_data
          is_aggregated
          business_segment
          business_sensitivity
        }
      }
      ${
        dataSourceName
          ? `sourceSpecificMetadata {
        ${getCustomQueryForDetailsPage(dataSourceName)}
      }`
          : ''
      }
      businessMetadata {
        asset_id
        asset_name
        owner
        administrativeMetadata {
          team
        }
        app
        descriptiveMetadata {
          description
          business_description
          applicable_policies {
            policy_id
            title
            description
            retention_min
            retention_max
          }
        }
        administrativeMetadata{
          team
          steward
          technical_data_steward
        }
      }
    }
  }
`;
};

export const UPDATE_ASSET_METADATA = () =>
  gql`
    mutation UpdateAssetMetadata($attributes: UpdateAssetMetadataInput!) {
      updateAssetMetadata(updateAssetMetadataInput: $attributes) {
        asset_id
        success
        message
        errorType
      }
    }
  `;

export const GET_ASSET_LINEAGE_INPUT_OR = () => {
  return gql`
    query getAssetLineage(
      $asset_id: String!
      $asset_type: AssetType!
      $relation_type: RelationType!
    ) {
      getAssetLineage(
        assetLineageinput: {
          lineageFilters: [
            {
              asset_id: $asset_id
              asset_type: $asset_type
              relation_type: $relation_type
            }
          ]
          limit: 100
          offset: 0
        }
      ) {
        lineages {
          src_id
          src_type
          src_name
          src_datasource
          dest_id
          dest_type
          dest_name
          dest_datasource
          relation_type
          clone_count
          executed_user
          execution_time
          query_referral_count
          hotness_score
        }
      }
    }
  `;
};

export const GET_ASSET_ANALYTICS = (assetId: string) => {
  return gql`
  {
    getAssetAnalytics(
      asset_ids: ["${assetId}"]
    ) {
      analytics {
        asset_id
        page_rank
        query_count
        hotness_score
        upstream_count
      }
    }
  }
`;
};

export const GET_ASSET_LINEAGE_INPUT = () => {
  return gql`
    query getAssetLineage($lineageFilters: [AssetLineageFilter!]!) {
      getAssetLineage(
        assetLineageinput: {
          lineageFilters: $lineageFilters
          limit: 100
          offset: 0
        }
      ) {
        lineages {
          src_id
          src_name
          src_type
          src_datasource
          src_database
          dest_id
          dest_name
          dest_type
          dest_datasource
          dest_database
          relation_type
          executed_user
          execution_time
          clone_count
        }
      }
    }
  `;
};

export const REQUEST_LINEAGE_REPORT = gql`
  mutation RequestLineageProcessing(
    $asset_ids: [String]
    $input_s3_path: String
    $request_name: String!
    $user_id: String!
    $email: String
    $direction: Direction!
    $depth: Int!
  ) {
    requestLineageProcessing(
      asset_ids: $asset_ids
      input_s3_path: $input_s3_path
      request_name: $request_name
      user_id: $user_id
      email: $email
      direction: $direction
      depth: $depth
    )
  }
`;

export const SEARCH_NODES = () => {
  return gql`
    query SearchNodes(
      $id: ID!
      $startType: NodeType!
      $includeTypes: [NodeType!]!
      $page: Int
    ) {
      searchNodes(
        filters: { id: $id, startType: $startType, includeTypes: $includeTypes }
        limit: 2000
        offset: $page
        depth: 1
      ) {
        edgeId
        node {
          _id
          name
          desc
          __typename
        }
        relationship
        relatedNode {
          _id
          name
          desc
          __typename
        }
      }
    }
  `;
};
