import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Name',
    width: '20%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_name'],
    },
    sortable: true,
    remoteSortField: 'asset_name',
  },
  {
    name: 'businessMetadata.asset_id',
    label: 'Asset ID',
    width: '15%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_id'],
    },
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    width: '10%',
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
    name: 'businessMetadata.owner',
    label: 'Owner',
    width: '10%',
    remoteSortField: 'owner',
    filter: {
      type: 'text',
      remoteSearchFields: ['owner'],
    },
  },
  {
    name: 'businessMetadata.administrativeMetadata.team',
    label: 'Team',
    width: '10%',
    remoteSortField: 'team',
    filter: {
      type: 'text',
      remoteSearchFields: ['team'],
    },
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    width: '15%',
    remoteSortField: 'description',
  },
  {
    name: 'sourceSpecificMetadata.LookerDashboard.external_url',
    label: 'External URL',
    width: '20%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Name',
    showInColumn: 0,
    description: 'Name of the dashboard',
  },
  {
    name: 'businessMetadata.asset_id',
    label: 'Id',
    showInColumn: 0,
    description: 'Id of the dashboard',
  },
  {
    name: 'businessMetadata.owner',
    label: 'Owner',
    showInColumn: 0,
    description: 'Owner',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 1,
    description: 'Asset environment',
  },
  {
    name: 'technicalMetadata.asset_type',
    label: 'Asset Type',
    showInColumn: 1,
    description: 'Asset type',
  },
  {
    name: 'technicalMetadata.asset_status',
    label: 'Asset Status',
    showInColumn: 3,
    description: 'Asset status',
  },
  {
    name: 'sourceSpecificMetadata.LookerDashboard.external_url',
    label: 'External Url',
    showInColumn: 2,
    description: 'External Url',
    type: 'link',
  },
  {
    name: 'businessMetadata.administrativeMetadata.team',
    label: 'Team',
    showInColumn: 3,
    description: 'Team',
  },
  {
    name: 'sourceSpecificMetadata.LookerDashboard.last_ingested',
    label: 'Last Ingested',
    showInColumn: 2,
    description: 'Last Ingested',
    type: 'date',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    showInColumn: 1,
    description: 'Description',
  },
];

const customQueryForListPage = `
  LookerDashboard {
    external_url
    last_ingested
  }
`;

const customQueryForDetailsPage = `
  LookerDashboard {
    external_url
    last_ingested
  }
`;

export const LookerDashboardConfig: DataSource = {
  id: '8',
  name: 'LookerDashboard',
  showColumns: false,
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
