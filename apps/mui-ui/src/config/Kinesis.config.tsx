import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Stream',
    width: '50%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_name'],
    },
    sortable: true,
    remoteSortField: 'asset_name',
  },
  {
    name: 'sourceSpecificMetadata.Kinesis.namespace',
    label: 'Namespace',
    width: '25%',
    filter: {
      type: 'aggregation',
      aggregationName: 'namespace_aggregation',
      remoteSearchFields: ['namespace'],
      filterSelectProps: {
        isClearable: true,
      },
    },
    remoteSortField: 'namespace',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    width: '8%',
    filter: {
      type: 'aggregation',
      aggregationName: 'env_aggregation',
      remoteSearchFields: ['env'],
      filterSelectProps: {
        isClearable: true,
      },
    },
    remoteSortField: 'env',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    width: '17%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Stream',
    showInColumn: 0,
    description: 'Stream',
  },
  {
    name: 'sourceSpecificMetadata.Kinesis.namespace',
    label: 'Namespace',
    showInColumn: 0,
    description: 'Asset registered namespace',
  },
  {
    name: 'sourceSpecificMetadata.Kinesis.createdAt',
    label: 'CreatedAt',
    showInColumn: 1,
    description: 'Created At',
    type: 'date',
  },
  {
    name: 'sourceSpecificMetadata.Kinesis.updatedAt',
    label: 'UpdatedAt',
    showInColumn: 1,
    description: 'Updated At',
    type: 'date',
  },
  {
    name: 'sourceSpecificMetadata.Kinesis.tags',
    label: 'Tags',
    showInColumn: 2,
    description: 'Asset tags',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    showInColumn: 2,
    description: 'Asset description',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    isEditable: false,
    label: 'Technical Description',
    remoteSaveField: 'technicalDescription',
    description: 'Technical Description',
  },
];

const customQueryForListPage = `
  Kinesis {
    namespace
  }
`;

const customQueryForDetailsPage = `
  Kinesis {
    namespace
    createdAt
    updatedAt
    tags
    columns {
      columnName
      dataType
    }
  }
`;

export const KinesisConfig: DataSource = {
  id: '6',
  name: 'Kinesis',
  showColumns: true,
  showPartitionColumns: false,
  showLineage: true,
  showLineageTable: true,
  showLineagePipeline: false,
  showLineageQuery: false,
  showLineageCloned: false,
  showLineageCW: false,
  showLineageColumn: false,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
