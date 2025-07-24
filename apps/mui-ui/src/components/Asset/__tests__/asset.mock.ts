import { Asset } from '../../../types/entities.types';
import snowflakeList from './SnowflakeList.mock.json';
import deltaLakeList from './DeltaLakeList.mock.json';

export const getAssetFromListByAssetId = (
  dataSource: string,
  assetId: string
): Asset => {
  const assets = (dataSource === 'DeltaLake'
    ? deltaLakeList
    : snowflakeList) as unknown as Asset[];
  return assets.find(
    asset => asset.businessMetadata.asset_id === assetId
  ) as Asset;
};
