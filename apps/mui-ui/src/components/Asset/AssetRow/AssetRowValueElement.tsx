import { FC } from 'react';
import { Asset, AssetRowValue } from '../../../types/entities.types';
import { getByDot } from '../../../utils';
import {
  AssetRowCustomLayer,
  AssetRowCustomLinks,
  AssetRowCustomTechnicalDescription,
} from './AssetRowCustomComponents';
import AssetRowCustomS3Bucket from './AssetRowCustomComponents/AssetRowCustomS3Bucket';
import AssetRowCustomLink from './AssetRowCustomComponents/AssetRowCustomLink';
import AssetRowUnusedAsset from './AssetRowCustomComponents/AssetRowUnusedAsset';

interface Props {
  asset: Asset;
  fieldName: string;
}

const AssetRowValueElement: FC<Props> = ({ asset, fieldName }) => {
  const getAssetListItem = (asset: Asset, fieldName: string): AssetRowValue => {
    switch (fieldName) {
      case 'businessMetadata.asset_name':
        const assetId = asset.businessMetadata.asset_id;
        const databaseName =
          asset?.sourceSpecificMetadata?.[asset.dataSource]?.database_name ||
          '_';
        const urlPath = asset.dataSource
          ? `/dataSource/${asset.dataSource}/database/${databaseName}/asset/${assetId}`
          : '/';
        let assetName = asset.businessMetadata.asset_name;
        try {
          assetName = asset.businessMetadata.asset_name
            ? decodeURIComponent(asset.businessMetadata.asset_name)
            : '';
        } catch (error) {
          console.warn('URL decode error', error);
        }
        return (
          <AssetRowCustomLink
            text={assetName}
            shouldOpenInNewTab={false}
            url={urlPath}
          />
        );
      case 'businessMetadata.descriptiveMetadata.description':
        return <AssetRowCustomTechnicalDescription asset={asset} />;
      case 'sourceSpecificMetadata.DeltaLake.layer':
        return <AssetRowCustomLayer asset={asset} />;
      case 'sourceSpecificMetadata.Snowflake.unused_table_status':
        return <AssetRowUnusedAsset asset={asset} />;
      case 'sourceSpecificMetadata.Harmony.harmonyURL':
        const text = asset?.sourceSpecificMetadata?.Harmony?.harmonyURL ?? '';
        const url = asset?.sourceSpecificMetadata?.Harmony?.harmonyURL ?? '';
        return <AssetRowCustomLink text={text} url={url} />;
      case 'sourceSpecificMetadata.Airflow.airflowURL':
        const airflowtext =
          asset?.sourceSpecificMetadata?.Airflow?.airflowURL ?? '';
        const airflowurl =
          asset?.sourceSpecificMetadata?.Airflow?.airflowURL ?? '';
        return <AssetRowCustomLink text={airflowtext} url={airflowurl} />;
      case 'sourceSpecificMetadata.LookerDataset.external_url':
        const lookertext =
          asset?.sourceSpecificMetadata?.LookerDataset?.external_url ?? '';
        const lookerurl =
          asset?.sourceSpecificMetadata?.LookerDataset?.external_url ?? '';
        return <AssetRowCustomLink text={lookertext} url={lookerurl} />;
      case 'sourceSpecificMetadata.TableauDashboard.external_url':
        const tableauDashboardtext =
          asset?.sourceSpecificMetadata?.TableauDashboard?.external_url ?? '';
        const tableauDashboardUrl =
          asset?.sourceSpecificMetadata?.TableauDashboard?.external_url ?? '';
        return (
          <AssetRowCustomLink
            text={tableauDashboardtext}
            url={tableauDashboardUrl}
          />
        );
      case 'sourceSpecificMetadata.TableauWidgets.external_url':
        const tableauWidgetstext =
          asset?.sourceSpecificMetadata?.TableauWidgets?.external_url ?? '';
        const tableauWidgetsUrl =
          asset?.sourceSpecificMetadata?.TableauWidgets?.external_url ?? '';
        return (
          <AssetRowCustomLink
            text={tableauWidgetstext}
            url={tableauWidgetsUrl}
          />
        );
      case 'sourceSpecificMetadata.LookerDashboard.external_url':
        const lookerDashboardtext =
          asset?.sourceSpecificMetadata?.LookerDashboard?.external_url ?? '';
        const lookerDashboardUrl =
          asset?.sourceSpecificMetadata?.LookerDashboard?.external_url ?? '';
        return (
          <AssetRowCustomLink
            text={lookerDashboardtext}
            url={lookerDashboardUrl}
          />
        );
      case 'sourceSpecificMetadata.LookerWidgets.external_url':
        const lookerWidgetsText =
          asset?.sourceSpecificMetadata?.LookerWidgets?.external_url ?? '';
        const lookerWidgetsUrl =
          asset?.sourceSpecificMetadata?.LookerWidgets?.external_url ?? '';
        return (
          <AssetRowCustomLink text={lookerWidgetsText} url={lookerWidgetsUrl} />
        );
      case 'links':
        return <AssetRowCustomLinks asset={asset} />;
      case 's3_bucket_name':
        return <AssetRowCustomS3Bucket asset={asset} />;
      default:
        return getByDot(asset, fieldName) as AssetRowValue;
    }
  };

  return <>{getAssetListItem(asset, fieldName)}</>;
};

export default AssetRowValueElement;
