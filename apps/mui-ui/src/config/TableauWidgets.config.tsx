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
    width: '15%',
    remoteSortField: 'owner',
    filter: {
      type: 'text',
      remoteSearchFields: ['owner'],
    },
  },
  {
    name: 'businessMetadata.administrativeMetadata.team',
    label: 'Team',
    width: '15%',
    remoteSortField: 'team',
    filter: {
      type: 'text',
      remoteSearchFields: ['team'],
    },
  },
  {
    name: 'sourceSpecificMetadata.TableauWidgets.external_url',
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
    name: 'technicalMetadata.asset_status',
    label: 'Asset Status',
    showInColumn: 3,
    description: 'Asset status',
  },
  {
    name: 'sourceSpecificMetadata.TableauWidgets.datahub_urn',
    label: 'Datahub URN',
    showInColumn: 3,
    description: 'Datahub URN',
  },
  {
    name: 'sourceSpecificMetadata.TableauWidgets.container_hierarchy',
    label: 'Container Hierarchy',
    showInColumn: 1,
    description: 'Container Hierarchy',
  },
  {
    name: 'sourceSpecificMetadata.TableauWidgets.external_url',
    label: 'External Url',
    showInColumn: 2,
    description: 'External Url',
    type: 'link',
  },
  {
    name: 'businessMetadata.administrativeMetadata.team',
    label: 'Team',
    showInColumn: 1,
    description: 'Team',
  },
  {
    name: 'sourceSpecificMetadata.TableauWidgets.last_ingested',
    label: 'Last Ingested',
    showInColumn: 2,
    description: 'Last Ingested',
    type: 'date',
  },
];

const customQueryForListPage = `
  TableauWidgets {
    external_url
    last_ingested
  }
`;

const customQueryForDetailsPage = `
  TableauWidgets {
    external_url
    last_ingested
    datahub_urn
    container_hierarchy
  }
`;

export const TableauWidgetsConfig: DataSource = {
  id: '11',
  name: 'TableauWidgets',
  showColumns: false,
  showPartitionColumns: false,
  showLineage: false,
  showLineageTable: false,
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
