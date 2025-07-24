import { FC } from 'react';
import { Asset } from '../../../../types/entities.types';
import { getS3PathBucket } from '../../../../utils/urls.utils';

interface Props {
  asset: Asset;
}

const AssetRowCustomS3Bucket: FC<Props> = ({ asset }) => (
  <>{getS3PathBucket(asset?.businessMetadata?.asset_id)}</>
);

export default AssetRowCustomS3Bucket;
