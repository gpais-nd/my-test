import { GridColumnHeader, SortDirection } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';
import { Tooltip } from '@mui/material';
import AlertDialog from '../components/AlertDialog';
import RedCircle from 'assets/icons/RedCircle';
import OrangeCircle from 'assets/icons/OrangeCircle';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'sourceSpecificMetadata.Snowflake.unused_table_status',
    label: (
      <AlertDialog label="Access Recency">
        <ul style={{ listStyleType: 'none' }}>
          <li>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RedCircle size="24" /> Up for deletion{' '}
            </h4>
            <p>
              <span style={{ fontWeight: 'bold' }}>Prod table</span> [hasn’t
              been accessed for 365 days] OR [hasn’t been accessed for 90 days
              and not altered for 180 days]
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Non prod table</span> [hasn’t
              been accessed for 30 days] AND [hasn’t been altered for 30 days]
            </p>
          </li>
          <li>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <OrangeCircle size="24" /> In risk of deletion (Applied only prod
              tables)
            </h4>
            <span style={{ fontWeight: 'bold' }}>Table</span> [hasn’t been
            accessed for 180 days] OR [hasn’t been accessed for 90 days and not
            altered for 90 days]
          </li>
        </ul>
      </AlertDialog>
    ),
    width: '10%',
    filter: {
      type: 'options',
      remoteSearchFields: ['unused_table_status'],
      options: [
        {
          value: 'Red',
          label: (
            <Tooltip title="table [hasn’t been accessed for 365 days] OR [hasn’t been accessed for 90 days and not altered for 180 days]">
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                  }}
                ></div>
                <span>Red</span>
              </div>
            </Tooltip>
          ),
        },
        {
          value: 'Orange',
          label: (
            <Tooltip title="table [hasn’t been accessed for 180 days] OR [hasn’t been accessed for 90 days and not altered for 90 days]">
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'orange',
                  }}
                ></div>
                <span>Orange</span>
              </div>
            </Tooltip>
          ),
        },
        {
          value: 'Normal',
          label: (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                }}
              ></div>
              <span>Normal</span>
            </div>
          ),
        },
      ],
      filterSelectProps: {
        isClearable: true,
      },
    },
    defaultSortType: SortDirection.DESC,
  },
  {
    name: 'businessMetadata.asset_name',
    label: 'Table',
    width: '28%',
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
    name: 'sourceSpecificMetadata.Snowflake.database_name',
    label: 'Database',
    width: '8%',
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
    name: 'businessMetadata.descriptiveMetadata.description',
    label: 'Technical Description',
    width: '20%',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    width: '11%',
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
    name: 'sourceSpecificMetadata.Snowflake.schema_name',
    label: 'Schema',
    width: '13%',
    filter: {
      type: 'text',
      remoteSearchFields: ['schema_name'],
    },
    sortable: true,
    remoteSortField: 'schema_name',
  },
  { name: 'links', label: 'Links', width: '12%' },
];

const attributesMap: Attribute[] = [
  {
    name: 'sourceSpecificMetadata.Snowflake.unused_table_status',
    label: 'Access Recency',
    isEditable: true,
    showInColumn: 2,
    type: 'string',
    editingOptions: [
      { value: 'Red', label: 'Red' },
      { value: 'Orange', label: 'Orange' },
      { value: 'Normal', label: 'Normal' },
    ],
    description: 'Access Recency',
  },
  {
    name: 'technicalMetadata.created_time',
    label: 'Created',
    showInColumn: 0,
    description: 'Created date',
    type: 'date',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_altered',
    label: 'Last Altered',
    showInColumn: 0,
    description: 'Last altered date',
    type: 'date',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 0,
    description: 'Environment',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.table_size_bytes',
    label: 'Table Size',
    showInColumn: 0,
    suffix: ' gigabytes',
    description: 'Table Size in gigabytes',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.airflowDagUrl',
    label: 'Airflow DAG URL',
    showInColumn: 0,
    type: 'link',
    description: 'Airflow DAG URL',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.airflowTaskID',
    label: 'Airflow Task ID',
    showInColumn: 0,
    type: 'string',
    description: 'Airflow Task ID',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.airflowDagID',
    label: 'Airflow DAG ID',
    showInColumn: 0,
    type: 'string',
    description: 'Airflow DAG ID',
  },
  {
    name: 'technicalMetadata.asset_age',
    label: 'Table Age',
    showInColumn: 0,
    suffix: ' days',
    description: 'Table Age',
  },

  {
    name: 'sourceSpecificMetadata.Snowflake.row_count',
    label: 'Rows',
    showInColumn: 0,
    suffix: ' millions',
    description: 'Number of rows in millions',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_accessed',
    label: 'Last Accessed',
    showInColumn: 1,
    description: 'Last accessed date',
  },
  {
    name: 'technicalMetadata.usageMetadata.last_accessed_age',
    label: 'Last Accessed Age',
    showInColumn: 1,
    suffix: ' days',
    description: 'Last accessed age in days',
  },
  {
    name: 'technicalMetadata.operationalMetadata.vcs',
    label: 'Version Control',
    type: 'link',
    isEditable: true,
    showInColumn: 1,
    remoteSaveField: 'vcs',
    description: 'Version Control URL',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.schema_name',
    label: 'Schema',
    showInColumn: 1,
    description: 'Asset schema name',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.documentation',
    label: 'Documentation',
    isEditable: true,
    showInColumn: 1,
    remoteSaveField: 'documentation',
    description: 'Documentation URL',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.is_cloned',
    label: 'Is Cloned',
    type: 'boolean',
    showInColumn: 1,
    description: 'Define if the asset has been cloned',
  },
  {
    name: 'sourceSpecificMetadata.Snowflake.clustering_key',
    label: 'Clustering Key',
    showInColumn: 1,
    description: 'Clustering Key',
  },
  {
    name: 'technicalMetadata.created_by',
    label: 'Created by',
    showInColumn: 1,
    description: 'Created by',
  },
  {
    name: 'technicalMetadata.asset_type',
    label: 'Type',
    showInColumn: 2,
    description: 'Asset type',
  },
  {
    name: 'technicalMetadata.asset_status',
    label: 'Status',
    showInColumn: 2,
    description: 'Asset status',
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
    description: 'Asset data steward',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.applicable_policies',
    label: 'Applicable Policies',
    type: 'link',
    showInColumn: 2,
    description: 'Applicable Policies',
  },
  {
    name: 'businessMetadata.descriptiveMetadata.business_description',
    label: 'Business Description',
    showInColumn: 2,
    description: 'Business Description',
  },

  {
    name: 'technicalMetadata.securityAndComplianceMetadata.data_classification',
    label: 'Data Classification',
    showInColumn: 2,
    description: 'Data Classification',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.data_sensitivity',
    label: 'Data Sensitivity',
    showInColumn: 2,
    description: 'Data Sensitivity',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.business_segment',
    label: 'Business Segment',
    type: 'array',
    showInColumn: 3,
    description: 'Business Segment',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.business_sensitivity',
    label: 'Business Sensitivity',
    showInColumn: 3,
    description: 'Business Sensitivity',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.is_aggregated',
    label: 'Is Aggregated',
    showInColumn: 3,
    description: 'Is Aggregated',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.child_data',
    label: 'Child Data',
    showInColumn: 3,
    description: 'Child Data',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.region',
    label: 'Region',
    showInColumn: 3,
    description: 'Region',
  },
  {
    name: 'technicalMetadata.securityAndComplianceMetadata.sub_region',
    label: 'Sub Region',
    type: 'array',
    showInColumn: 3,
    description: 'Sub Region',
  },
  {
    name: 'technicalMetadata.operationalMetadata.act_monthly_storage_cost',
    label: 'Storage Monthly Cost',
    type: 'string',
    prefix: '$',
    showInColumn: 3,
    description: 'Storage Monthly Cost',
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
  Snowflake {
    database_name
    schema_name
    unused_table_status
  }
`;

const customQueryForDetailsPage = `
  Snowflake {
    database_name
    documentation
    airflowDagID
    airflowDagUrl
    airflowTaskID
    clustering_key
    deleted
    is_cloned
    fail_safe_bytes
    retained_for_clone_bytes
    row_count
    schema_name
    table_id
    table_size_bytes
    time_travel_bytes
    unused_table_status
    columns {
      columnName
      description
      dataType
      defaultValue
      nullable
      dataTypeDetails
    }
    custom_fields {
      name
      value
    }
  }
`;

export const SnowflakeConfig: DataSource = {
  id: '1',
  name: 'Snowflake',
  showColumns: true,
  showPartitionColumns: false,
  showLineage: true,
  showLineageTable: true,
  showLineageQuery: false,
  showLineageCloned: false,
  showLineageCW: false,
  showLineageColumn: true,
  showLineagePipeline: false,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
