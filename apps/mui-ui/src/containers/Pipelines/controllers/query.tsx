import { gql } from '@apollo/client';

export const GET_PIPELINE_LINEAGES = () => {
  return gql`
    query GetPipelineLineage {
      getPipelineLineage(
        assetLineageinput: {
          lineageFilters: [{ relation_type: AF_DOWNSTREAM }]
          limit: 10000
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
        }
      }
    }
  `;
};

export const GET_PIPELINE_LINEAGE = () => {
  return gql`
    query getPipelineLineage($lineageFilters: [AssetLineageFilter!]!) {
      getPipelineLineage(
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
          src_owners
          src_team
          src_critical
          src_dag_sla
          src_dag_avg_execution_time
          dest_id
          dest_name
          dest_type
          dest_datasource
          dest_owners
          dest_team
          dest_critical
          dest_dag_sla
          dest_dag_avg_execution_time
          relation_type
        }
      }
    }
  `;
};
