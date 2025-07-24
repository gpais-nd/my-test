import { FC } from 'react';
import { Asset, TableLayerTypes } from '../../../../types/entities.types';
import { useGetTableLayerTypes } from '../../../../hooks/useGetTableLayerTypes';

interface Props {
  asset: Asset;
}

const AssetRowCustomLayer: FC<Props> = ({ asset }) => {
  const tableLayerTypes = useGetTableLayerTypes();
  const layer =
    asset?.sourceSpecificMetadata?.[asset.dataSource]?.layer ?? null;

  return layer ? (
    <a
      href="https://github.bamtech.co/pages/data-eng/metastore/layers/"
      target="_blank"
      rel="noreferrer"
    >
      {tableLayerTypes[layer as keyof TableLayerTypes]?.icon}
    </a>
  ) : (
    <></>
  );
};

export default AssetRowCustomLayer;
