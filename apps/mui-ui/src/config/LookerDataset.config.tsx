import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Table',
    width: '33%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_name'],
    },
    sortable: true,
    remoteSortField: 'asset_name',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    width: '33%',
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
    name: 'sourceSpecificMetadata.LookerDataset.external_url',
    label: 'External URL',
    width: '33%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Table Name',
    showInColumn: 0,
    description: 'Table Name',
  },
  {
    name: 'businessMetadata.asset_id',
    label: 'Table Id',
    showInColumn: 0,
    description: 'Table Id',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 0,
    description: 'Asset environment',
  },
  {
    name: 'technicalMetadata.asset_status',
    label: 'Asset Status',
    showInColumn: 1,
    description: 'Asset status',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    showInColumn: 2,
    description: 'Description',
  },
  {
    name: 'sourceSpecificMetadata.LookerDataset.external_url',
    label: 'External Url',
    showInColumn: 1,
    description: 'External Url',
  },
  {
    name: 'sourceSpecificMetadata.LookerDataset.last_ingested',
    label: 'Last Ingested',
    showInColumn: 2,
    description: 'Last Ingested',
    type: 'date',
  },
  {
    name: 'businessMetadata.administrativeMetadata.technical_data_steward',
    isEditable: true,
    label: 'Technical Data Steward',
    remoteSaveField: 'technicalDataSteward',
    showInColumn: 2,
    type: 'array',
    description: 'Technical Data Steward',
  },
  {
    name: 'businessMetadata.administrativeMetadata.steward',
    label: 'Steward',
    type: 'emails',
    showInColumn: 2,
    description: 'Steward',
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
  LookerDataset {
    external_url
    last_ingested
  }
`;

const customQueryForDetailsPage = `
  LookerDataset {
    external_url
    last_ingested
    columns {
      columnName
      description
      dataType
      defaultValue
      nullable
      dataTypeDetails
    }
  }
`;

export const LookerDatasetConfig: DataSource = {
  id: '7',
  name: 'LookerDataset',
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

// Validation error of type SubSelectionRequired: Sub selection required for type null of field custom_fields @ 'getAssets/assets/sourceSpecificMetadata/Looker/custom_fields'
