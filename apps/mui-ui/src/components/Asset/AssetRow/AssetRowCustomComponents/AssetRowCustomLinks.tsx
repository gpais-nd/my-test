import { FC } from 'react';
import { Asset } from '../../../../types/entities.types';
import { GridPillLink } from '../../../Grid/GridPillLink';
import { s3PathToAwsConsoleUrl } from '../../../../utils/urls.utils';

interface Props {
  asset: Asset;
}

const AssetRowCustomLinks: FC<Props> = ({ asset }) => (
  <>
    {asset?.technicalMetadata?.operationalMetadata &&
      asset?.technicalMetadata?.operationalMetadata?.vcs &&
      asset?.technicalMetadata?.operationalMetadata?.vcs !== '' && (
        <GridPillLink
          key={0}
          type="primary"
          label="Github"
          url={asset.technicalMetadata.operationalMetadata.vcs}
        />
      )}
    {asset?.dataSource === 'DeltaLake' &&
      asset?.businessMetadata?.asset_id &&
      asset?.businessMetadata?.asset_id !== '' && (
        <GridPillLink
          key={1}
          type="secondary"
          label="Location"
          url={s3PathToAwsConsoleUrl(asset.businessMetadata.asset_id)}
        />
      )}
    {asset?.sourceSpecificMetadata &&
      asset?.sourceSpecificMetadata[asset.dataSource]?.documentation &&
      asset?.sourceSpecificMetadata[asset.dataSource]?.documentation !== '' && (
        <GridPillLink
          key={2}
          type="tertiary"
          label="Documentation"
          url={
            asset.sourceSpecificMetadata[asset.dataSource].documentation ?? ''
          }
        />
      )}
  </>
);

export default AssetRowCustomLinks;
