import TableLayerIconGold from '../assets/icons/TableLayerIconGold';
import { GridColumnHeader, SortDirection } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';
import TableLayerIconSilver from '../assets/icons/TableLayerIconSilver';
import TableLayerIconBronze from '../assets/icons/TableLayerIconBronze';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'sourceSpecificMetadata.DeltaLake.layer',
    label: 'Layer',
    width: '11%',
    filter: {
      type: 'options',
      options: [
        { value: 'None', label: 'None' },
        {
          value: 'gold',
          label: (
            <>
              <TableLayerIconGold size="20" /> Gold
            </>
          ),
        },
        {
          value: 'silver',
          label: (
            <>
              <TableLayerIconSilver size="20" /> Silver
            </>
          ),
        },
        {
          value: 'bronze',
          label: (
            <>
              <TableLayerIconBronze size="20" /> Bronze
            </>
          ),
        },
      ],
      remoteSearchFields: ['layer'],
      filterSelectProps: {
        isClearable: true,
      },
    },
    sortable: true,
    remoteSortField: 'layer',
    defaultSortBy: 'layer',
    defaultSortType: SortDirection.DESC,
  },
  {
    name: 'businessMetadata.asset_name',
    label: 'Table',
    width: '20%',
    filter: {
      type: 'text',
      remoteSearchFields: ['asset_name'],
    },
    sortable: true,
    remoteSortField: 'asset_name',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.glue_table_name',
    label: 'Glue Table Name',
    width: '18%',
    filter: {
      type: 'text',
      remoteSearchFields: ['glue_table_name'],
      customQuery: {
        operator: 'ilike',
        key: 'sourceSpecificMetadata.DeltaLake.glue_table_name',
      },
    },
    sortable: true,
    remoteSortField: 'glue_table_name',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.database_name',
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
    name: 's3_bucket_name',
    label: 'S3 Bucket',
    width: '16%',
    filter: {
      type: 'aggregation',
      aggregationName: 'bucket_aggregation',
      remoteSearchFields: ['bucket_name'],
      filterSelectProps: {
        isClearable: true,
      },
    },
  },
  {
    name: 'businessMetadata.app',
    label: 'App',
    width: '11%',
    filter: {
      type: 'aggregation',
      aggregationName: 'app_aggregation',
      remoteSearchFields: ['app'],
      filterSelectProps: {
        isClearable: true,
      },
    },
    sortable: true,
    remoteSortField: 'app',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Technical Description',
    width: '21%',
  },
  {
    name: 'businessMetadata.administrativeMetadata.team',
    label: 'Team',
    width: '10%',
    filter: {
      type: 'text',
      remoteSearchFields: ['team'],
      customQuery: {
        operator: 'ilike',
        key: 'businessMetadata.administrativeMetadata.team',
      },
    },
    sortable: true,
    remoteSortField: 'team',
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
  { name: 'links', label: 'Links', width: '12%' },
];

const attributesMap: Attribute[] = [
  {
    name: 'sourceSpecificMetadata.DeltaLake.glue_table_name',
    label: 'Glue Table Name',
    showInColumn: 0,
    isEditable: true,
    remoteSaveField: 'glue_table_name',
    editableOnNull: true,
    description: 'Glue Table Name',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.unitycatalogue_table_name',
    label: 'Unity Catalog Table Name',
    type: 'link',
    showInColumn: 0,
    description: 'Unity Catalog Table Name',
  },
  {
    name: 'technicalMetadata.created_time',
    label: 'Created',
    showInColumn: 0,
    description: 'Created',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_altered',
    label: 'Updated',
    showInColumn: 0,
    description: 'Last time this field was updated',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.location_href',
    label: 'Location',
    type: 'link',
    showInColumn: 0,
    linkText: 'businessMetadata.asset_id',
    description: 'Location URL',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.documentation',
    label: 'Documentation',
    type: 'link',
    isEditable: true,
    showInColumn: 0,
    remoteSaveField: 'documentation',
    description: 'Documentation URL',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.docsProducer',
    label: 'Producer Documentation',
    isEditable: true,
    type: 'link',
    showInColumn: 0,
    remoteSaveField: 'docsProducer',
    description: 'Producer Documentation URL',
  },
  {
    name: 'technicalMetadata.operationalMetadata.vcs',
    label: 'Version Control',
    type: 'link',
    isEditable: true,
    showInColumn: 0,
    remoteSaveField: 'vcs',
    description: 'Version Control URL',
  },

  {
    name: 'subjectMatterExperts',
    label: 'Subject Matter Experts',
    type: 'link',
    showInColumn: 1,
    description: 'Subject Matter Experts',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.format',
    label: 'Format',
    showInColumn: 1,
    description: 'Format',
  },
  {
    name: 'businessMetadata.administrativeMetadata.team',
    label: 'Team',
    isEditable: true,
    showInColumn: 1,
    remoteSaveField: 'team',
    description: 'Team who manage this asset',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 1,
    description: 'Related to the asset environment',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.namespace',
    label: 'Namespace',
    isEditable: true,
    showInColumn: 1,
    remoteSaveField: 'namespace',
    description: 'Asset Namespace',
  },
  {
    name: 'businessMetadata.app',
    label: 'App',
    isEditable: true,
    showInColumn: 1,
    remoteSaveField: 'app',
    description: 'Asset App',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.pool',
    label: 'Pool',
    isEditable: true,
    showInColumn: 1,
    remoteSaveField: 'pool',
    description: 'Asset Pool',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.layer',
    label: 'Layer',
    isEditable: true,
    showInColumn: 2,
    type: 'link',
    linkTo: 'https://github.bamtech.co/pages/data-eng/metastore/layers/',
    remoteSaveField: 'layer',
    editingOptions: [
      { value: 'None', label: 'None' },
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
      { value: 'bronze', label: 'Bronze' },
    ],
    description: 'Asset Layer defines the access level of the asset',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.upstream',
    label: 'Upstream',
    type: 'commaSeparated',
    separator: ';',
    isEditable: false,
    showInColumn: 2,
    description: 'Asset direction',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.containsPII',
    label: 'Contains PII?',
    description: 'Contains Personally Identifiable Information?',
    type: 'boolean',
    isEditable: true,
    showInColumn: 2,
    remoteSaveField: 'containsPII',
    editingOptions: [
      { value: '1', label: 'True' },
      { value: '0', label: 'False' },
    ],
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.SOXFLagged',
    label: 'SOX Flagged?',
    type: 'boolean',
    isEditable: true,
    showInColumn: 2,
    remoteSaveField: 'sOXFLagged',
    editingOptions: [
      { value: '1', label: 'True' },
      { value: '0', label: 'False' },
    ],
    description: 'SOX Compliance Flagged',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.deprecated',
    label: 'Deprecated?',
    type: 'boolean',
    isEditable: true,
    showInColumn: 2,
    remoteSaveField: 'deprecated',
    editingOptions: [
      { value: '1', label: 'True' },
      { value: '0', label: 'False' },
    ],
    description: 'Describes if the asset is Deprecated',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.replacedBy',
    label: 'Replaced By',
    isEditable: true,
    remoteSaveField: 'replacedBy',
    showInColumn: 2,
    description: 'Asset replaced by',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.zordering',
    label: 'Delta Z-Ordering',
    type: 'commaSeparated',
    showInColumn: 2,
    description: 'Z-ordering direaction',
  },
  {
    name: 'observability', // TODO: Not found
    label: 'Observability',
    showInColumn: 2,
    description: 'Observability',
  },

  {
    name: 'partitionRecordCounts',
    label: 'Partition Record Counts',
    type: 'link',
    showInColumn: 3,
    description: 'Partition Record Counts',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_altered_partition',
    label: 'Last Modified Partition',
    type: 'link',
    showInColumn: 3,
    description: 'Last time this field was updated',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.mostRecentDatabricksJob',
    label: 'Most Recent Databricks Job',
    type: 'link',
    showInColumn: 3,
    linkText: 'sourceSpecificMetadata.DeltaLake.jobName',
    description: 'Defines which is the most recent databricks job',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.airflowDagID',
    label: 'Airflow DAG ID & Task ID',
    type: 'link',
    showInColumn: 3,
    description: 'Defines which airflow DAG ID & Task ID',
  },
  {
    name: 'consumptionAnalytics',
    label: 'Consumption Analytics',
    showInColumn: 3,
    type: 'link',
    description: 'Consumption Analytics URL',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.streaming',
    label: 'Streaming',
    type: 'boolean',
    showInColumn: 3,
    description: 'Streaming',
  },
  {
    name: 'sourceSpecificMetadata.DeltaLake.snowflakeExtView',
    label: 'Snowflake Externalized View',
    isEditable: true,
    showInColumn: 3,
    remoteSaveField: 'snowflakeExtView',
    description: 'Snowflake Externalized View',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.description',
    isEditable: true,
    label: 'Technical Description',
    remoteSaveField: 'technicalDescription',
    description: 'Technical Description',
  },
  {
    name: 'businessMetadata.administrativeMetadata.technical_data_steward',
    isEditable: true,
    label: 'Technical Data Steward',
    remoteSaveField: 'technicalDataSteward',
    showInColumn: 2,
    type: 'array',
    description:
      'Defines who is the people to turn to in order to understand how the data is created, manipulated, stored, and moved in technical systems',
  },
  {
    name: 'businessMetadata.administrativeMetadata.steward',
    isEditable: false,
    label: 'Steward',
    remoteSaveField: 'Steward',
    showInColumn: 2,
    description:
      'Team member responsible for overseeing a specific subset of an organization`s information, ensuring its quality, integrity, and security',
  },
];

const customQueryForListPage = `
  DeltaLake {
    location
    location_href
    table_id
    documentation
    database_name
    glue_table_name
    layer
  }
`;

const customQueryForDetailsPage = `
  DeltaLake {
    location
    location_href
    documentation
    format
    namespace
    pool
    layer
    containsPII
    SOXFLagged
    partitionColumns {
      columnName
      dataType
      description
    }
    jobName
    mostRecentDatabricksJob
    glue_table_name
    upstream
    replacedBy
    deprecated
    streaming
    docsProducer
    snowflakeExport
    snowflakeExtView
    zordering
    airflowDagID
    airflowTaskID
    airflowDagUrl
    enable_auto_update_glue_table
    unitycatalogue_table_name
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

export const DeltaLakeConfig: DataSource = {
  id: '2',
  name: 'DeltaLake',
  showColumns: true,
  showPartitionColumns: true,
  showAutoUpdateGlueTableSwitch: true,
  showLineage: true,
  showLineageTable: true,
  showLineageQuery: false,
  showLineageCloned: false,
  showLineageCW: false,
  showLineagePipeline: false,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
