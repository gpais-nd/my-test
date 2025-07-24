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
    width: '20%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_id'],
    },
  },
  {
    name: 'businessMetadata.owner',
    label: 'Owner',
    width: '20%',
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
    name: 'sourceSpecificMetadata.TableauDashboard.external_url',
    label: 'External URL',
    width: '30%',
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
    name: 'sourceSpecificMetadata.TableauDashboard.datahub_urn',
    label: 'Datahub URN',
    showInColumn: 1,
    description: 'Datahub URN',
  },
  {
    name: 'sourceSpecificMetadata.TableauDashboard.container_hierarchy',
    label: 'Container Hierarchy',
    showInColumn: 2,
    description: 'Container Hierarchy',
    type: 'array',
  },
  {
    name: 'sourceSpecificMetadata.TableauDashboard.external_url',
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
];

const customQueryForListPage = `
  TableauDashboard {
    external_url
  }
`;

const customQueryForDetailsPage = `
  TableauDashboard {
    external_url
    datahub_urn
    container_hierarchy
  }
`;

export const TableauDashboardConfig: DataSource = {
  id: '8',
  name: 'TableauDashboard',
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
