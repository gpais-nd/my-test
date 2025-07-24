import { DatasourcesEnum } from 'utils/datasources.utils';
import { QueryTypeEnum } from 'utils/lineage.utils';
import {
  datasourceIsDataflow,
  datasourceIsDashboard,
  datasourceIsWidget,
  getPlatformById,
} from 'utils/urls.utils';
import { NodeFlowCustomData } from 'types/flow.types';

// These fields are used by the lineage flow query
const dataTypesByTable = ['DATASET', 'DATAFLOW'];
const dataTypesByTableSnowflake = [
  'DATASET',
  'DATAFLOW',
  'WIDGET',
  'DASHBOARD',
];
const dataTypesByTableLookerTableau = [
  'DATASET',
  'DATAFLOW',
  'WIDGET',
  'DASHBOARD',
];
const dataTypesByColumn = ['FIELD'];

interface RGB {
  r: number;
  g: number;
  b: number;
}

export const queryTypesSearchNodes = [
  QueryTypeEnum.TABLE,
  QueryTypeEnum.COLUMN,
  QueryTypeEnum.DASHBOARD,
  QueryTypeEnum.WIDGET,
  QueryTypeEnum.PIPELINE,
];

export const rgbToHex = (color: RGB): string => {
  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${componentToHex(color.r)}${componentToHex(color.g)}${componentToHex(
    color.b
  )}`;
};
export const getNodeColor = (depth?: number): string => {
  let color: RGB;

  if (depth) {
    switch (depth) {
      case 1:
        color = { r: 189, g: 222, b: 243 };
        break;
      case 2:
        color = { r: 113, g: 175, b: 192 };
        break;
      case 3:
        color = { r: 232, g: 209, b: 201 };
        break;
      case 4:
        color = { r: 255, g: 195, b: 159 };
        break;
      case 5:
        color = { r: 180, g: 82, b: 46 };
        break;
      case 6:
        color = { r: 231, g: 76, b: 60 };
        break;
      case 7:
        color = { r: 241, g: 196, b: 15 };
        break;
      case 8:
        color = { r: 26, g: 188, b: 156 };
        break;
      default:
        const baseLevel = depth % 8 || 8;
        const baseLevelColor = getNodeColor(baseLevel);

        const hex = baseLevelColor.slice(1);
        color = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
        };

        const adjustment = Math.floor((depth - 8) / 8) * 30;
        color = {
          r: Math.min(255, Math.max(0, color.r - adjustment)),
          g: Math.min(255, Math.max(0, color.g - adjustment)),
          b: Math.min(255, Math.max(0, color.b - adjustment)),
        };
    }
    return rgbToHex(color);
  } else {
    return 'rgb(113, 175, 192)';
  }
};

export const getTypesByQueryType = (
  queryType: QueryTypeEnum,
  datasource?: string
) => {
  switch (queryType) {
    case QueryTypeEnum.TABLE:
      if (datasource === DatasourcesEnum.Snowflake) {
        return dataTypesByTableSnowflake;
      }
      if (datasource?.includes('Looker') || datasource?.includes('Tableau')) {
        return dataTypesByTableLookerTableau;
      }
      return dataTypesByTable;
    case QueryTypeEnum.COLUMN:
      return dataTypesByColumn;
    default:
      return [];
  }
};

export const getStartTypeByQueryType = (
  queryType: QueryTypeEnum,
  originVertexType: string
) => {
  switch (queryType) {
    case QueryTypeEnum.TABLE:
      return originVertexType;
    case QueryTypeEnum.COLUMN:
      return 'FIELD';
    default:
      return '';
  }
};

export const getRootType = (dataSource: string, queryType: QueryTypeEnum) => {
  switch (queryType) {
    case QueryTypeEnum.PIPELINE:
      return 'Pipeline';
    case QueryTypeEnum.COLUMN:
      return 'Field';
    case QueryTypeEnum.JOB:
      return 'Datajob';
    case QueryTypeEnum.TABLE:
      if (datasourceIsDataflow(dataSource)) {
        return 'Dataflow';
      }
      if (datasourceIsDashboard(dataSource)) {
        return 'Dashboard';
      }
      if (datasourceIsWidget(dataSource)) {
        return 'Widget';
      }
      return 'Dataset';
    default:
      return 'Dataset';
  }
};

export const getUrlFromNodeId = (node: NodeFlowCustomData) => {
  const platform = getPlatformById(node.id);
  const origin = location.origin;
  const deltaDb = node.data.label?.split('/')[3];
  const snowDb = node.data.label?.split('.')[0];
  const assetId = node.data.label?.toString().toLowerCase();
  // TODO: Delta (s3) works only if DB is dataeng_qa or dataeng_prod
  let path = '';

  switch (platform) {
    case 'airflow':
      path = `${origin}/dataSource/Airflow/database/_/asset/https://airflow.disneystreaming.com/tree/lineage?dag_id=${assetId}`;
      return path;
    case 'databricks':
      return path;
    case 'deltalake':
      path = `${origin}/dataSource/DeltaLake/database/dataeng_${deltaDb}/asset/${assetId}/lineage`;
      return path;
    case 's3':
      path = `${origin}/dataSource/DeltaLake/database/dataeng_${deltaDb}/asset/${assetId}/lineage`;
      return path;
    case 'snowflake':
      path = `${origin}/dataSource/Snowflake/database/${snowDb}/asset/disneystreaming_us-east-1.${assetId}/lineage`;
      return path;
    default:
      return path;
  }
};
