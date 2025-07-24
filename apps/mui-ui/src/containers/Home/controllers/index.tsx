import { gql } from '@apollo/client';

// I removed the filter databaseName: "${REACT_APP_HOMEPAGE_DB_FILTER}" since no data was being returned
export const GET_TABLES = gql`
  query GetTablesHomepage {
    tables(
      filters: {
        key: "layer"
        operator: in_
        value: ["gold", "bronze", "silver"]
      }
    ) {
      id: name
      databaseName
      name
      location
      comment
      docs
      vcs
      app
      layer
      format
    }
  }
`;

export default GET_TABLES;
