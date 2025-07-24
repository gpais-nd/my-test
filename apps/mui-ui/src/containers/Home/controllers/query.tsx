import { gql } from '@apollo/client';
import { DataSource } from 'types/entities.types';
import { isPipelineDataSource } from 'utils/datasources.utils';

const queryByDataSource = (dataSource: DataSource): string => {
  return dataSource.name
    ? `${dataSource.name}: getAssets(assetMetadataInput: { dataSource: "${
        dataSource.name
      }" ${
        isPipelineDataSource(dataSource.name) ? ',asset_type: "pipeline"' : ''
      } }) {
        row_count
      }, `
    : '';
};

export const GET_TABLES_COUNT = (dataSources: DataSource[]) =>
  gql`
  {
    ${dataSources.reduce((acc, dataSource) => {
      return acc + queryByDataSource(dataSource) + ' ';
    }, '')}
  }
`;
