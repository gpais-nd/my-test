import { FC } from 'react';
import { Asset, TableUnusedAssetTypes } from '../../../../types/entities.types';
import { useGetTableUnusedAssetTypes } from '../../../../hooks/useGetTableUnusedAssetTypes';

interface Props {
  asset: Asset;
}

const AssetRowUnusedAsset: FC<Props> = ({ asset }) => {
  const tableLayerTypes = useGetTableUnusedAssetTypes();
  const hoverText = getHoverText(
    asset?.sourceSpecificMetadata?.Snowflake?.unused_table_status
  );
  const unusedAsset =
    asset?.sourceSpecificMetadata?.[asset.dataSource]?.unused_table_status ??
    null;

  return unusedAsset ? (
    <div title={hoverText}>
      {tableLayerTypes[unusedAsset as keyof TableUnusedAssetTypes]?.icon}
    </div>
  ) : (
    <></>
  );
};

function getHoverText(unusedTableStatus: string | null): string {
  switch (unusedTableStatus ?? '') {
    case 'Red':
      return 'Up for deletion';
    case 'Orange':
      return 'In risk of deletion';
    case 'Normal':
      return 'Access recency: normal';
    default:
      return 'Unused asset';
  }
}

export default AssetRowUnusedAsset;
