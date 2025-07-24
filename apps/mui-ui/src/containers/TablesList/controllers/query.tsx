import { gql } from '@apollo/client';
import { getCustomQueryForListPage } from '../../../config/dataSources.config';

export const GET_ASSETS_LIST = (
  dataSourceName: string,
  limit: number,
  offset: number,
  filtersString: string,
  sortedColumnsString: string
) => gql`
  {
    getAssets(assetMetadataInput: {
      dataSource: "${dataSourceName}",
      limit: ${limit},
      offset: ${offset} 
      ${filtersString} 
      ${sortedColumnsString}}) {
      assets {
        businessMetadata {
          asset_id
          asset_name
          administrativeMetadata {
            team
          }
          descriptiveMetadata {
            description
          }
          owner
          app
        }
        ${
          dataSourceName
            ? `sourceSpecificMetadata {
          ${getCustomQueryForListPage(dataSourceName)}
        }`
            : ''
        }
        dataSource
        technicalMetadata {
          asset_age
          asset_status
          asset_type
          created_by
          created_time
          env
          operationalMetadata {
            active_bytes
            est_monthly_cost
            source_control_url
            table_size
            vcs
          }
          securityAndComplianceMetadata {
            data_sensitivity
          }
          usageMetadata {
            last_accessed
            last_accessed_age
            top_queries
          }
        }
      }
      aggregations {
        database_aggregation {
          doc_count_error_upper_bound
          sum_other_doc_count
          buckets {
            doc_count
            key
          }
        }
        app_aggregation {
          doc_count_error_upper_bound
          sum_other_doc_count
          buckets {
              key
              doc_count
          }
        }
      }
      row_count
    }
  }
`;

export const GET_AGGREGATIONS = (dataSourceName: string) => gql`
  {
    getAggregations(dataSource: "${dataSourceName}") {
      database_aggregation {
        doc_count_error_upper_bound
        sum_other_doc_count
        buckets {
          key
          doc_count
        }
      }
      app_aggregation {
        doc_count_error_upper_bound
        sum_other_doc_count
        buckets {
          key
          doc_count
        }
      }
      env_aggregation {
        doc_count_error_upper_bound
        sum_other_doc_count
        buckets {
          key
          doc_count
        }
      }
      asset_type_aggregation {
        doc_count_error_upper_bound
        sum_other_doc_count
        buckets {
          key
          doc_count
        }
      }
      harmony_cluster_aggregation {
        doc_count_error_upper_bound
        sum_other_doc_count
        buckets {
          key
          doc_count
        }
      }
      bucket_aggregation{
        sum_other_doc_count
        doc_count_error_upper_bound
        buckets{
          key
          doc_count
        }
      }
      namespace_aggregation{
        sum_other_doc_count
        doc_count_error_upper_bound
        buckets{
          key
          doc_count
        }
      }
    }
  }
`;
