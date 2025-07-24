import { NodeType } from '../types/entities.types';
import { DatasourcesEnum } from './datasources.utils';

const s3Url = require('s3-url');

const removeLastSlash = (url: string) =>
  url.endsWith('/') ? url.substring(0, url.length - 1) : url;

export const s3PathToAwsConsoleUrl = (s3Location: string) => {
  const { Bucket, Key } = s3Url.urlToOptions(s3Location);
  const Region = 'us-east-1';
  return `https://s3.console.aws.amazon.com/s3/buckets/${Bucket}?region=${Region}&prefix=${Key}/&showversions=false`;
};

export const getS3PathBucket = (s3Location: string): string => {
  const { Bucket } = s3Url.urlToOptions(s3Location);
  return Bucket ?? '';
};

export const getS3PathPrefix = (s3Location: string): string => {
  const urlParams = new URLSearchParams(s3Location.split('?')[1]);
  return removeLastSlash(urlParams.get('prefix') ?? '');
};

const getS3Path = (s3Location: string): string => {
  const bucket = getS3PathBucket(s3Location) + '/';
  if (bucket !== '' && s3Location.includes(bucket)) {
    return s3Location.split(bucket)[1];
  } else {
    return s3Location;
  }
};

const getAirflowAssetId = (assetId: string): string => {
  const urlParams = new URLSearchParams(assetId.split('?')[1]);
  return removeLastSlash(urlParams.get('dag_id') ?? '');
};

// TODO: define how to get proper endpoint in each case
const getUrnEndpoint = (
  dataSource: string,
  assetId: string,
  externalUrl?: string
): string => {
  if (dataSource === 'DeltaLake') {
    return getS3PathBucket(assetId);
  } else if (dataSource === 'Airflow') {
    return 'airflow.disneystreaming.com';
  } else if (dataSource === 'Databricks') {
    return 'dss-dataeng-prod-us-east-1.cloud.databricks.com';
  } else if (dataSource === 'Snowflake') {
    return 'disneystreaming.us-east-1.snowflakecomputing.com';
  } else if (dataSource === 'Hive') {
    return 'sox-hive-services-lb_las_prod_hulu_com';
  } else if (dataSource === 'Harmony') {
    return 'harmony.prod.hulu.com';
  } else if (dataSource === 'Kinesis') {
    return 'kinesis://141988508569/us-east-1';
  } else if (dataSource === 'UnityCatalog') {
    return assetId.split('.')[0];
  } else if (dataSource.includes('Looker')) {
    return externalUrl?.includes('github')
      ? 'github.com'
      : 'looker.disneystreaming.com';
  } else if (dataSource.includes('Tableau')) {
    return 'tableau.disneystreaming.com';
  } else {
    return '';
  }
};

export const getPlatformById = (assetId: string) => {
  const regex = /platform:(\w+)/;
  const result = assetId.match(regex);
  if (result && result[1]) {
    return result[1];
  }
  return '';
};

/**
 * Checks if a given platform is available for URL generation.
 *
 * @param platform - The name of the platform to check.
 * @returns True if the platform is in the list of available platforms, false otherwise.
 */

export const getAvailablePlatformsToUrl = (platform: string) => {
  const availablePlatforms = [
    'deltaLake',
    'snowflake',
    'airflow',
    's3',
    'unity',
    'lookerdataset',
    'lookerdashboard',
    'lookerwidgets',
  ];
  return availablePlatforms.includes(platform);
};

/**
 * Returns a unique identifier for a given asset based on its data source type.
 *
 * @param dataSource - The name of the data source (e.g., DeltaLake, Airflow, UnityCatalog, Kinesis, LookerDashboard, LookerWidgets).
 * @param assetId - The asset ID used to derive the unique identifier.
 * @returns A string representing the unique identifier for the asset. The method of deriving this identifier
 *          depends on the type of data source:
 *          - DeltaLake: Uses the S3 path derived from the asset ID.
 *          - Airflow: Uses the DAG ID extracted from the asset ID.
 *          - UnityCatalog: Extracts and concatenates specific parts of the asset ID.
 *          - Kinesis: Combines parts of the asset ID to form a unique string.
 *          - LookerDashboard or LookerWidgets: Extracts a specific part of the asset ID.
 *          - Other data sources: Returns the asset ID as is.
 */

const getUrnUniqueId = (dataSource: string, assetId: string): string => {
  if (dataSource === DatasourcesEnum.DeltaLake) {
    return getS3Path(assetId);
  } else if (dataSource === DatasourcesEnum.Airflow) {
    const dagId = getAirflowAssetId(assetId);
    return dagId;
  } else if (dataSource === DatasourcesEnum.UnityCatalog) {
    const unityId = assetId.split('urn:');
    const unityIdDetails = unityId[0].split('.');
    const uniqueId = unityIdDetails
      .slice(1, Math.min(unityIdDetails.length, 4))
      .join('.');
    return uniqueId;
  } else if (dataSource === DatasourcesEnum.Kinesis) {
    const kinesisId = assetId.split('urn:')[0].split('.')[1];
    const kinesisDss = `urn:${assetId.split('urn:')[1]}`;
    return `${kinesisId}${kinesisDss}`;
  } else if (
    datasourceIsDashboard(dataSource) ||
    datasourceIsWidget(dataSource)
  ) {
    return assetId.split('.')[1];
  } else {
    return assetId;
  }
};

export const getNodeDatasourceByAssetId = (assetId: string) => {
  const regex = /platform:(\w+)/;
  const result = assetId.match(regex);
  if (result && result[1]) {
    switch (result[1].toLowerCase()) {
      case 'deltalake':
        return DatasourcesEnum.DeltaLake;
      case 's3':
        return DatasourcesEnum.DeltaLake;
      case 'snowflake':
        return DatasourcesEnum.Snowflake;
      case 'databricks':
        return DatasourcesEnum.Databricks;
      case 'airflow':
        return DatasourcesEnum.Airflow;
      case 'hive':
        return DatasourcesEnum.Hive;
      case 'harmony':
        return DatasourcesEnum.Harmony;
      case 'unity':
        return DatasourcesEnum.UnityCatalog;
      case 'lookerDataset':
        return DatasourcesEnum.LookerDataset;
      case 'lookerdashboard':
        return DatasourcesEnum.LookerDashboard;
      case 'lookerwidgets':
        return DatasourcesEnum.LookerWidgets;
      case 'tableauDataset':
        return DatasourcesEnum.TableauDataset;
      case 'tableauDashboard':
        return DatasourcesEnum.TableauDashboard;
      case 'tableauWidgets':
        return DatasourcesEnum.TableauWidgets;
      case 'kinesis':
        return DatasourcesEnum.Kinesis;
      default:
        return DatasourcesEnum.DeltaLake;
    }
  }
};

export const extractNameFromId = (id: string): string => {
  const unprocessedName = id.split(':');
  return unprocessedName[unprocessedName.length - 1];
};

export const datasourceIsDataflow = (dataSource: string) => {
  return (
    dataSource === DatasourcesEnum.Airflow ||
    dataSource === DatasourcesEnum.Harmony
  );
};

export const datasourceIsDashboard = (dataSource: string) => {
  return (
    dataSource === DatasourcesEnum.LookerDashboard ||
    dataSource === DatasourcesEnum.TableauDashboard
  );
};

export const datasourceIsWidget = (dataSource: string) => {
  return (
    dataSource === DatasourcesEnum.LookerWidgets ||
    dataSource === DatasourcesEnum.TableauWidgets
  );
};

export const getUrn = (
  nodeType: NodeType,
  dataSource: string,
  assetId: string,
  externalUrl?: string,
  jobOrDag?: 'job' | 'dag',
  jobOrDagId?: string
): string => {
  const getPlatformUrn = () =>
    getUrn('Platform', dataSource, assetId, externalUrl);
  const getDatasetUrn = () =>
    getUrn('Dataset', dataSource, assetId, externalUrl);
  const getUniqueId = () => getUrnUniqueId(dataSource, assetId);

  // Handlers
  const handlers: Record<NodeType, () => string> = {
    Platform: () => {
      const endpoint = getUrnEndpoint(dataSource, assetId, externalUrl);
      const platformName =
        dataSource === 'DeltaLake'
          ? 's3'
          : dataSource === 'UnityCatalog'
          ? 'unity-catalog'
          : dataSource.includes('Looker')
          ? 'looker'
          : dataSource.includes('Tableau')
          ? 'tableau'
          : dataSource.toLowerCase();

      return `urn:oms:platform:${platformName}${
        endpoint ? `:${endpoint}` : ''
      }`;
    },

    Dataset: () => {
      return `urn:oms:dataset:(${getPlatformUrn()}):${getUniqueId()}`;
    },

    Field: () => {
      const rawAssetId = assetId.split('.');
      const columnId = rawAssetId[rawAssetId.length - 1];
      return `urn:oms:field:(${getDatasetUrn()}):${columnId}`;
    },

    Dataflow: () => {
      if (dataSource === 'Airflow') {
        return `urn:oms:dataflow:(${getPlatformUrn()}):${getUniqueId()}`;
      }

      if (dataSource === 'Harmony') {
        const harmonyId = decodeURI(assetId).replace(
          'https://harmony.prod.hulu.com/bash/',
          ''
        );
        return `urn:oms:dataflow:(${getPlatformUrn()}):${harmonyId}`;
      }

      return `urn:oms:dataflow:(${getPlatformUrn()}):${jobOrDag}:${assetId}`;
    },

    Datajob: () => {
      return `urn:oms:datajob:(${getPlatformUrn()}:${jobOrDagId}):task:${assetId}`;
    },
    Pipeline: function (): string {
      throw new Error('Function not implemented.');
    },
    Compute: function (): string {
      throw new Error('Function not implemented.');
    },
    Owner: function (): string {
      throw new Error('Function not implemented.');
    },
    Dashboard: function (): string {
      return `urn:oms:dashboard:(${getPlatformUrn()}):${getUniqueId()}`;
    },
    Widget: function (): string {
      return `urn:oms:widget:(${getPlatformUrn()}):${getUniqueId()}`;
    },
    DataQuery: function (): string {
      throw new Error('Function not implemented.');
    },
    Alert: function (): string {
      throw new Error('Function not implemented.');
    },
    Incident: function (): string {
      throw new Error('Function not implemented.');
    },
    MLRegistry: function (): string {
      throw new Error('Function not implemented.');
    },
    MLModel: function (): string {
      throw new Error('Function not implemented.');
    },
  };

  const defaultHandler = () =>
    `urn:oms:dataset:(${getPlatformUrn()}):${assetId}`;

  const handler = handlers[nodeType] ?? defaultHandler;
  return handler();
};
