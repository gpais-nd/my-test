import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Widget ID',
    width: '20%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_name'],
    },
    sortable: true,
    remoteSortField: 'asset_name',
  },
  {
    name: 'sourceSpecificMetadata.LookerWidgets.name',
    label: 'Widget Title',
    width: '25%',
    filter: {
      type: 'text',
      remoteSearchFields: ['widget_name'],
    },
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    width: '30%',
  },
  {
    name: 'sourceSpecificMetadata.LookerWidgets.external_url',
    label: 'External URL',
    width: '25%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Id',
    showInColumn: 0,
    description: 'Id of the widget',
  },
  {
    name: 'sourceSpecificMetadata.LookerWidgets.name',
    label: 'Title',
    showInColumn: 0,
    description: 'Title of the widget',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    showInColumn: 1,
    description: 'Description',
  },
  {
    name: 'sourceSpecificMetadata.LookerWidgets.external_url',
    label: 'External Url',
    showInColumn: 2,
    description: 'External Url',
    type: 'link',
  },
  {
    name: 'sourceSpecificMetadata.LookerWidgets.last_ingested',
    label: 'Last Ingested',
    showInColumn: 3,
    description: 'Last Ingested',
    type: 'date',
  },
  {
    name: 'sourceSpecificMetadata.LookerWidgets.upstream_fields ',
    label: 'Upstream Fields',
    showInColumn: 1,
    description: 'Upstream Fields',
  },
];

const customQueryForListPage = `
  LookerWidgets {
    external_url
    last_ingested
    name
  }
`;

const customQueryForDetailsPage = `
  LookerWidgets {
    external_url
    last_ingested
  }
`;

export const LookerWidgetsConfig: DataSource = {
  id: '9',
  name: 'LookerWidgets',
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
