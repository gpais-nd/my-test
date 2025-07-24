import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Asset Name',
    width: '30%',
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
    width: '22%',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.catalog_name',
    label: 'Catalog name',
    width: '20%',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.schema_name',
    label: 'Schema name',
    width: '20%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'businessMetadata.asset_id',
    label: 'Asset Id',
    showInColumn: 0,
    description: 'Asset id',
  },
  {
    name: 'businessMetadata.asset_name',
    label: 'Asset Name',
    showInColumn: 0,
    description: 'Asset name',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.table_id',
    label: 'Table Id',
    showInColumn: 0,
    description: 'Table id',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.table_name',
    label: 'Table Name',
    showInColumn: 0,
    description: 'Table name',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 0,
    description: 'Asset environment',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.storage_path',
    label: 'Storage Path',
    showInColumn: 0,
    description: 'Storage path',
  },
  {
    name: 'technicalMetadata.asset_type',
    label: 'Asset Type',
    showInColumn: 0,
    description: 'Asset type',
  },
  {
    name: 'technicalMetadata.asset_age',
    label: 'Asset Age',
    showInColumn: 1,
    description: 'Asset age',
    suffix: ' days',
  },
  {
    name: 'technicalMetadata.created_time',
    label: 'Created Time',
    showInColumn: 1,
    description: 'Created time',
    type: 'date',
  },
  {
    name: 'technicalMetadata.created_by',
    label: 'Created By',
    showInColumn: 1,
    description: 'Created by',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_altered_age',
    label: 'Last Altered Age',
    showInColumn: 1,
    description: 'Last altered age',
    suffix: ' days',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_altered_by',
    label: 'Last Altered By',
    showInColumn: 1,
    description: 'Last altered by',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_altered',
    label: 'Last Altered Date',
    showInColumn: 1,
    description: 'Last altered date',
    type: 'date',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Description',
    showInColumn: 1,
    description: 'Asset description',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.metastore_id',
    label: 'Metastore Id',
    showInColumn: 2,
    description: 'Metastore id',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.catalog_name',
    label: 'Table Catalog',
    showInColumn: 2,
    description: 'Table catalog',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.schema_name',
    label: 'Table Schema',
    showInColumn: 2,
    description: 'Table schema',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.is_insertable_into',
    label: 'Is Insertable Into',
    showInColumn: 2,
    type: 'boolean',
    description: 'Is insertable into',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.format',
    label: 'Format',
    showInColumn: 2,
    description: 'Format',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.properties',
    label: 'Properties',
    type: 'list',
    showInColumn: 2,
    description: 'Properties',
  },
  {
    name: 'sourceSpecificMetadata.UnityCatalog.clustering_columns',
    label: 'Clustering Columns',
    type: 'commaSeparated',
    showInColumn: 2,
    description: 'Clustering columns',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    isEditable: true,
    label: 'Technical Description',
    remoteSaveField: 'technicalDescription',
    description: 'Technical Description',
  },
];

const customQueryForListPage = `
  UnityCatalog {
    metastore_id
    is_insertable_into
    format
    storage_path
    table_id
    table_name
    catalog_name
    schema_name
    clustering_columns
  }
`;

const customQueryForDetailsPage = `
  UnityCatalog {
    metastore_id
    is_insertable_into
    format
    storage_path
    table_id
    table_name
    catalog_name
    schema_name
    clustering_columns
    properties {
      name
      value
    }
    partition_columns {
      columnName
      description
      dataType
    }
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

export const UnityCatalogConfig: DataSource = {
  id: '7',
  name: 'UnityCatalog',
  showColumns: true,
  showPartitionColumns: true,
  showLineage: true,
  showLineageTable: true,
  showLineagePipeline: false,
  showLineageQuery: false,
  showLineageCloned: false,
  showLineageCW: false,
  showLineageColumn: true,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
