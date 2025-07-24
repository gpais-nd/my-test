import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Table',
    width: '40%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_name'],
    },
    sortable: true,
    remoteSortField: 'asset_name',
  },
  {
    name: 'technicalMetadata.asset_type',
    label: 'Type',
    width: '10%',
    filter: {
      type: 'aggregation',
      aggregationName: 'asset_type_aggregation',
      remoteSearchFields: ['asset_type'],
      filterSelectProps: {
        isClearable: true,
      },
    },
    sortable: true,
    remoteSortField: 'asset_type',
  },
  {
    name: 'sourceSpecificMetadata.Hive.database_name',
    label: 'Database',
    width: '16%',
    filter: {
      type: 'aggregation',
      aggregationName: 'database_aggregation',
      remoteSearchFields: ['database_name'],
      filterSelectProps: {
        isClearable: true,
      },
    },
    sortable: true,
    remoteSortField: 'database_name',
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
    sortable: true,
    remoteSortField: 'env',
  },
  {
    name: 'sourceSpecificMetadata.Hive.schema_name',
    label: 'Schema',
    width: '13%',
    filter: {
      type: 'text',
      remoteSearchFields: ['schema_name'],
    },
    sortable: true,
    remoteSortField: 'schema_name',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Technical Description',
    width: '20%',
  },
  { name: 'links', label: 'Links', width: '12%' },
];

const attributesMap: Attribute[] = [
  {
    name: 'technicalMetadata.created_time',
    label: 'Created',
    showInColumn: 0,
    description: 'Created',
    type: 'date',
  },
  {
    name: 'sourceSpecificMetadata.Hive.modified_date',
    label: 'Updated',
    showInColumn: 0,
    description: 'Updated',
  },
  {
    name: 'sourceSpecificMetadata.Hive.database_name',
    label: 'Database',
    showInColumn: 0,
    description: 'Database',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 0,
    description: 'Asset environment',
  },
  {
    name: 'sourceSpecificMetadata.Hive.location',
    label: 'Location',
    type: 'link',
    showInColumn: 0,
    linkText: 'sourceSpecificMetadata.Hive.location',
    description: 'Location',
  },

  {
    name: 'sourceSpecificMetadata.Hive.schema_name',
    label: 'Schema',
    showInColumn: 0,
    description: 'Schema',
  },
  {
    name: 'sourceSpecificMetadata.Hive.capacity_used',
    label: 'Capacity Used',
    showInColumn: 0,
    description: 'Capacity Used',
  },

  {
    name: 'sourceSpecificMetadata.Hive.depth',
    label: 'Depth',
    showInColumn: 1,
    description: 'Depth defines the asset level of hierarchy',
  },
  {
    name: 'sourceSpecificMetadata.Hive.input_format',
    label: 'Input Format',
    showInColumn: 1,
    description: 'Input Format',
  },
  {
    name: 'sourceSpecificMetadata.Hive.output_format',
    label: 'Output Format',
    showInColumn: 1,
    description: 'Output Format',
  },
  {
    name: 'sourceSpecificMetadata.Hive.is_partitioned',
    label: 'Is partitioned',
    showInColumn: 1,
    type: 'boolean',
    description: 'Is partitioned',
  },
  {
    name: 'sourceSpecificMetadata.Hive.compressed',
    label: 'Compressed',
    showInColumn: 1,
    type: 'boolean',
    description: 'Compressed',
  },
  {
    name: 'sourceSpecificMetadata.Hive.num_of_files',
    label: 'Number of Files',
    showInColumn: 1,
    description: 'Number of files',
  },
  {
    name: 'sourceSpecificMetadata.Hive.num_of_partitions',
    label: 'Number of Partitions',
    showInColumn: 2,
    description: 'Number of partitions',
  },
  {
    name: 'sourceSpecificMetadata.Hive.num_of_rows',
    label: 'Rows',
    showInColumn: 2,
    description: 'Number of rows',
  },
  {
    name: 'sourceSpecificMetadata.Hive.owner',
    label: 'Owner',
    showInColumn: 2,
    description: 'Owner',
  },
  {
    name: 'sourceSpecificMetadata.Hive.owner_type',
    label: 'Owner Type',
    showInColumn: 2,
    description: 'Owner type',
  },
  {
    name: 'sourceSpecificMetadata.Hive.raw_data_size',
    label: 'Raw Data Size',
    showInColumn: 2,
    description: 'Raw data size',
  },
  {
    name: 'sourceSpecificMetadata.Hive.scan_date',
    label: 'Scan Date',
    showInColumn: 2,
    description: 'Scan date',
  },
  {
    name: 'sourceSpecificMetadata.Hive.last_ddl_time',
    label: 'Last DDL Time',
    showInColumn: 2,
    description: 'Last DDL Time',
  },
  {
    name: 'sourceSpecificMetadata.Hive.partitionkeys',
    label: 'Partition Keys',
    showInColumn: 3,
    description: 'Partition keys',
  },
  {
    name: 'technicalMetadata.asset_age',
    label: 'Table Age',
    showInColumn: 3,
    suffix: ' days',
    description: 'Table Age',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_accessed',
    label: 'Last Accessed',
    showInColumn: 3,
    description: 'Last Accessed',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_accessed_age',
    label: 'Last Accessed Age',
    showInColumn: 3,
    suffix: ' days',
    description: 'Last Accessed Age',
  },
  {
    name: 'technicalMetadata.operationalMetadata.vcs',
    label: 'Version Control',
    type: 'link',
    isEditable: true,
    showInColumn: 3,
    remoteSaveField: 'vcs',
    description: 'Version Control URL',
  },
  {
    name: 'technicalMetadata.created_by',
    label: 'Created by',
    showInColumn: 3,
    description: 'Created by',
  },
  {
    name: 'technicalMetadata.asset_type',
    label: 'Type',
    showInColumn: 3,
    description: 'Asset type',
  },
  {
    name: 'technicalMetadata.asset_status',
    label: 'Status',
    showInColumn: 3,
    description: 'Asset status',
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
  Hive {
    location
    database_name
  }
`;

const customQueryForDetailsPage = `
  Hive {
    table_id
    database_name
    schema_name
    location
    capacity_used
    depth
    input_format
    output_format
    is_partitioned
    compressed
    num_of_files
    num_of_partitions
    num_of_rows
    owner
    owner_type
    raw_data_size
    scan_date
    last_ddl_time
    partitionkeys
    modified_date
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

export const HiveConfig: DataSource = {
  id: '4',
  name: 'Hive',
  showColumns: true,
  showLineage: false,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
