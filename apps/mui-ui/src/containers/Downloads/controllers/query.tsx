import { gql } from '@apollo/client';

export const GET_LINEAGE_REQUESTS_STATUS = gql`
  query GetLineageRequestsStatus(
    $userId: String!
    $limit: Int = 50
    $offset: Int = 0
  ) {
    getLineageRequestsStatus(
      filters: { userId: $userId }
      limit: $limit
      offset: $offset
      sortType: desc
    ) {
      result {
        depth
        request_id
        request_status
        asset_ids
        output_s3_path
        request_name
        requested_date
        archived
        lineage_direction
        bulk_request
        date_completed
        failed_assets
        number_of_assets_failed
        number_of_assets_requested
        number_of_assets_processed
        comments
      }
      row_count
    }
  }
`;
