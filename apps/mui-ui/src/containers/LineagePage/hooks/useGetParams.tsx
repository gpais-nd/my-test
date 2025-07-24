import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AssetSummary, DataSource } from '../../../types/entities.types';
import { getDataSourceByName } from 'utils/datasources.utils';
import { useLazyQuery } from '@apollo/client';
import { Error } from '../../../types/utils.types';
import { APIAssetMetadataResponse } from '../../../types/api.types';
import { useApolloErrorHandler } from '../../../sideEffects/api/useApolloErrorHandler';
import { DatasourcesEnum } from 'utils/datasources.utils';
import { GET_ASSET_METADATA } from 'containers/TableDetails/controllers/query';

interface GetParametersOutput {
  asset?: AssetSummary;
  dataSource?: DataSource;
  loading: boolean;
  error: Error | undefined;
}

export const useGetParams = (): GetParametersOutput => {
  const { apolloErrorHandler } = useApolloErrorHandler();
  const [asset, setAsset] = useState<AssetSummary>();
  const [dataSource, setDataSource] = useState<DataSource>();
  const { dataSourceName } = useParams<{ dataSourceName: string }>();
  const assetId = decodeURIComponent(
    location.pathname.split(`lineage/${dataSourceName}/`)[1]
  );

  const [queryAssetMetadata, { loading, error }] =
    useLazyQuery<APIAssetMetadataResponse>(
      GET_ASSET_METADATA(dataSource?.name ?? '', assetId ?? ''),
      {
        fetchPolicy: 'cache-and-network',
      }
    );

  useEffect(() => {
    if (error) {
      apolloErrorHandler(error);
    }
  }, [error]);

  useEffect(() => {
    if (dataSourceName) {
      setDataSource(getDataSourceByName(dataSourceName));
    }
  }, [dataSourceName]);

  useEffect(() => {
    if (assetId) {
      queryAssetMetadata().then(response => {
        setAsset({
          id: assetId,
          name: parseAssetName(response as unknown as APIAssetMetadataResponse),
        });
      });
    }
  }, [assetId]);

  const parseAssetName = (responseData: APIAssetMetadataResponse): string => {
    let parsedAssetName = '';

    if (
      responseData &&
      responseData.data &&
      responseData.data.getAssetMetadata
    ) {
      const assetName =
        dataSourceName && dataSourceName === DatasourcesEnum.DeltaLake
          ? responseData.data.getAssetMetadata.sourceSpecificMetadata[
              dataSourceName
            ].unitycatalogue_table_name ??
            responseData.data.getAssetMetadata.businessMetadata.asset_id
          : responseData.data.getAssetMetadata.businessMetadata.asset_name;

      if (dataSourceName && dataSourceName === DatasourcesEnum.DeltaLake) {
        if (assetName) {
          parsedAssetName = assetName;
        } else {
          parsedAssetName =
            responseData.data.getAssetMetadata.businessMetadata.asset_id;
        }
      } else {
        parsedAssetName = assetName;
      }
    }

    return parsedAssetName;
  };

  return {
    asset,
    dataSource,
    loading,
    error,
  };
};
