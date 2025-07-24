import { FC } from 'react';
import { Asset } from '../../../../types/entities.types';
import { OverflowText } from '../../../OverflowText';
import styles from './../AssetRowValueElement.module.scss';

interface Props {
  asset: Asset;
}

const AssetRowCustomTechnicalDescription: FC<Props> = ({ asset }) => (
  <div className={styles.assetRowCustomTechnicalDescription}>
    <OverflowText>
      {asset?.businessMetadata?.descriptiveMetadata &&
      asset?.businessMetadata?.descriptiveMetadata?.description
        ? asset.businessMetadata.descriptiveMetadata.description
        : ''}
    </OverflowText>
  </div>
);

export default AssetRowCustomTechnicalDescription;
