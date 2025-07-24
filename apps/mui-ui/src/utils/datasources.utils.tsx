import { DataSource } from 'types/entities.types';
import { DeltaLakeConfig } from '../config/DeltaLake.config';
import { SnowflakeConfig } from '../config/Snowflake.config';
import { HiveConfig } from '../config/Hive.config';
import { HarmonyConfig } from '../config/Harmony.config';
import { AirflowConfig } from '../config/Airflow.config';
import { KinesisConfig } from '../config/Kinesis.config';
import { LookerDatasetConfig } from '../config/LookerDataset.config';
import { LookerDashboardConfig } from '../config/LookerDashboard.config';
import { LookerWidgetsConfig } from '../config/LookerWidgets.config';
import { UnityCatalogConfig } from '../config/UnityCatalog.config';
import { TableauWidgetsConfig } from 'config/TableauWidgets.config';
import { TableauDatasetConfig } from 'config/TableauDataset.config';
import { TableauDashboardConfig } from 'config/TableauDashboard.config';
import snowIcon from '../assets/logos/snowIc.svg';
import deltaIcon from '../assets/logos/deltalake_red.svg';
import airflowIcon from '../assets/logos/airflowIc2.svg';
import databricksIcon from '../assets/logos/databricks.svg';
import tableauIcon from '../assets/logos/tableau.svg';
import lookerIcon from '../assets/logos/looker.svg';
import hiveIcon from '../assets/logos/hive_logo.svg';
import glueIcon from '../assets/logos/awsglue.svg';
import harmonyIcon from '../assets/logos/harmony.svg';
import KinesisIcon from '../assets/logos/aws-kinesis.svg';
import databaseIcon from '../assets/logos/database.svg';
import unityIcon from '../assets/logos/unity.svg';
/* import lookerDashboardIcon from '../assets/logos/looker_dashboard.svg';
import lookerWidgetsIcon from '../assets/logos/looker_widgets.svg';
import tableauDashboardIcon from '../assets/logos/tableau_dashboard.svg';
import tableauWidgetsIcon from '../assets/logos/tableau_widgets.svg'; */
import fieldIcon from '../assets/logos/dbfield.svg';
import jobIcon from '../assets/logos/dbjob.svg';
import tableIcon from '../assets/logos/dbtable.svg';
import datasetIcon from '../assets/logos/dataset.svg';
import datajobIcon from '../assets/logos/datajob.svg';
import dataflowIcon from '../assets/logos/dataflow.svg';
import datafieldIcon from '../assets/logos/datafield.svg';
import widgetIcon from '../assets/logos/widget.svg';
import pipelineIcon from '../assets/logos/pipeline.svg';
import dashboardIcon from '../assets/logos/dashboard.svg';
import { NodeTypeEnum, QueryTypeEnum } from './lineage.utils';

export const dataSourcesParameters: DataSource[] = [
  SnowflakeConfig,
  DeltaLakeConfig,
  HiveConfig,
  HarmonyConfig,
  AirflowConfig,
  KinesisConfig,
  LookerDatasetConfig,
  LookerDashboardConfig,
  LookerWidgetsConfig,
  TableauDatasetConfig,
  TableauWidgetsConfig,
  TableauDashboardConfig,
  UnityCatalogConfig,
];

export enum DatasourcesEnum {
  Snowflake = 'Snowflake',
  DeltaLake = 'DeltaLake',
  Airflow = 'Airflow',
  Databricks = 'Databricks',
  Hive = 'Hive',
  Harmony = 'Harmony',
  Kinesis = 'Kinesis',
  LookerDataset = 'LookerDataset',
  LookerDashboard = 'LookerDashboard',
  LookerWidgets = 'LookerWidgets',
  TableauDataset = 'TableauDataset',
  TableauDashboard = 'TableauDashboard',
  TableauWidgets = 'TableauWidgets',
  UnityCatalog = 'UnityCatalog',
  Glue = 'Glue',
}

export const getPlatformIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'snowflake':
      return snowIcon;
    case 'deltalake':
      return deltaIcon;
    case 's3':
      return deltaIcon;
    case 'glue':
      return glueIcon;
    case 'airflow':
      return airflowIcon;
    case 'databricks':
      return databricksIcon;
    case 'tableau':
      return tableauIcon;
    case 'tableaudataset':
      return tableauIcon;
    case 'tableaudashboard':
      return tableauIcon;
    case 'tableauwidgets':
      return tableauIcon;
    case 'hive':
      return hiveIcon;
    case 'looker':
      return lookerIcon;
    case 'lookerdataset':
      return lookerIcon;
    case 'lookerdashboard':
      return lookerIcon;
    case 'lookerwidgets':
      return lookerIcon;
    case 'harmony':
      return harmonyIcon;
    case 'kinesis':
      return KinesisIcon;
    case 'unity':
      return unityIcon;
    case 'unitycatalog':
      return unityIcon;
    default:
      return databaseIcon;
  }
};

export const getNodeTypeIcon = (queryType: string) => {
  switch (queryType) {
    case NodeTypeEnum.Dataset:
      return datasetIcon;
    case NodeTypeEnum.Dataflow:
      return dataflowIcon;
    case NodeTypeEnum.Datajob:
      return datajobIcon;
    case NodeTypeEnum.Widget:
      return widgetIcon;
    case NodeTypeEnum.Pipeline:
      return pipelineIcon;
    case NodeTypeEnum.Field:
      return datafieldIcon;
    case NodeTypeEnum.Dashboard:
      return dashboardIcon;
    default:
      return tableIcon;
  }
};

export const getQueryTypeIcon = (queryType: string) => {
  switch (queryType?.toUpperCase()) {
    case QueryTypeEnum.TABLE:
      return tableIcon;
    case QueryTypeEnum.JOB:
      return jobIcon;
    case QueryTypeEnum.COLUMN:
      return fieldIcon;
    case QueryTypeEnum.DASHBOARD:
      return dashboardIcon;
    case QueryTypeEnum.WIDGET:
      return widgetIcon;
    default:
      return tableIcon;
  }
};

export const getDataSourceByName = (
  dataSourceName: string
): DataSource | undefined =>
  dataSourcesParameters.find(dataSource => dataSource.name === dataSourceName);

const datasourcesBase = [
  {
    name: DatasourcesEnum.Snowflake,
    label: DatasourcesEnum.Snowflake,
    logo: getPlatformIcon(DatasourcesEnum.Snowflake),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.DeltaLake,
    label: DatasourcesEnum.DeltaLake,
    logo: getPlatformIcon(DatasourcesEnum.DeltaLake),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.Airflow,
    label: DatasourcesEnum.Airflow,
    logo: getPlatformIcon(DatasourcesEnum.Airflow),
    metadataLabel: 'Pipeline',
    isPipeline: true,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.Harmony,
    label: DatasourcesEnum.Harmony,
    logo: getPlatformIcon(DatasourcesEnum.Harmony),
    metadataLabel: 'Pipeline',
    isPipeline: true,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.Kinesis,
    label: DatasourcesEnum.Kinesis,
    logo: getPlatformIcon(DatasourcesEnum.Kinesis),
    metadataLabel: 'Stream',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.Databricks,
    label: DatasourcesEnum.Databricks,
    logo: getPlatformIcon(DatasourcesEnum.Databricks),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: false,
  },
  {
    name: DatasourcesEnum.LookerDataset,
    label: 'Looker Datasets',
    logo: getPlatformIcon(DatasourcesEnum.LookerDataset),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.LookerWidgets,
    label: 'Looker Widgets',
    logo: getPlatformIcon(DatasourcesEnum.LookerWidgets),
    metadataLabel: 'Widget',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.LookerDashboard,
    label: 'Looker Dashboard',
    logo: getPlatformIcon(DatasourcesEnum.LookerDashboard),
    metadataLabel: 'Dashboard',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.TableauDataset,
    label: 'Tableau Dataset',
    logo: getPlatformIcon(DatasourcesEnum.TableauDataset),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.TableauWidgets,
    label: 'Tableau Widgets',
    logo: getPlatformIcon(DatasourcesEnum.TableauWidgets),
    metadataLabel: 'Widget',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.TableauDashboard,
    label: 'Tableau Dashboard',
    logo: getPlatformIcon(DatasourcesEnum.TableauDashboard),
    metadataLabel: 'Dashboard',
    isPipeline: false,
    isLineageEnabled: true,
  },
  {
    name: DatasourcesEnum.Hive,
    label: DatasourcesEnum.Hive,
    logo: getPlatformIcon(DatasourcesEnum.Hive),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: false,
  },
  {
    name: DatasourcesEnum.UnityCatalog,
    label: 'Unity Catalog',
    logo: getPlatformIcon(DatasourcesEnum.UnityCatalog),
    metadataLabel: 'Table',
    isPipeline: false,
    isLineageEnabled: true,
  },
];

export const isPipelineDataSource = (dataSource: string) => {
  const source = datasourcesBase.find(ds => ds.name === dataSource);
  return source ? source.isPipeline === true : false;
};

export const labelByDataSource = (dataSource: string) => {
  const source = datasourcesBase.find(ds => ds.name === dataSource);
  return source?.metadataLabel ?? 'Table';
};

export const isEnabledDatasource = (dataSource: string) => {
  const source = datasourcesBase.find(ds => ds.name === dataSource);
  return source ? source.isLineageEnabled === true : false;
};

export const getLogo = (dataSource: string) => {
  const source = datasourcesBase.find(ds => ds.name === dataSource);
  return source?.logo ?? '';
};

export const getLogoByPlatform = (platform: string) => {
  const platformsNotMappedInDatasources = ['s3', 'glue'];
  if (!platformsNotMappedInDatasources.includes(platform)) {
    // return getPlatformIcon(platform);
    return getLogo(platform);
  } else {
    switch (platform.toLowerCase()) {
      case 's3':
        return getPlatformIcon(DatasourcesEnum.DeltaLake);
      case 'glue':
        return getPlatformIcon(DatasourcesEnum.Glue);
      default:
        return '';
    }
  }
};
