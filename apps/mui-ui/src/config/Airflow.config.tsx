import { GridColumnHeader } from '../components/Grid/types';
import { Attribute, DataSource } from '../types/entities.types';

const gridHeaders: GridColumnHeader[] = [
  {
    name: 'businessMetadata.asset_name',
    label: 'Pipeline',
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
    name: 'technicalMetadata.asset_type',
    label: 'Type',
    width: '16%',
    filter: {
      type: 'fixed',
      remoteSearchFields: ['asset_type'],
      selectedValue: 'pipeline',
    },
    sortable: true,
  },
  {
    name: 'sourceSpecificMetadata.Airflow.owner',
    label: 'Owner',
    width: '16%',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.tags',
    label: 'Tags',
    width: '16%',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.airflowURL',
    label: 'Airflow URL',
    width: '22%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'sourceSpecificMetadata.Airflow.airflowURL',
    label: 'Airflow URL',
    type: 'link',
    showInColumn: 0,
    description: 'Airflow URL',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.datahubURN',
    label: 'Datahub URN',
    showInColumn: 0,
    description: 'Datahub URN',
  },
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 0,
    description: 'Asset environment',
  },
  {
    name: 'technicalMetadata.asset_type',
    label: 'Asset Type',
    showInColumn: 0,
    description: 'Asset type',
  },
  {
    name: 'technicalMetadata.operationalMetadata.asset_daily_cost',
    label: 'DAG Daily Cost',
    type: 'string',
    prefix: '$',
    showInColumn: 3,
    description: 'DAG Daily Cost',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.pipeline',
    label: 'Pipeline',
    showInColumn: 0,
    description: 'Pipeline name',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.pipeline_job',
    label: 'Pipeline Job',
    showInColumn: 1,
    description: 'Pipeline job name',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.owner',
    label: 'Owner',
    showInColumn: 1,
    description: 'Asset owner',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.cluster',
    label: 'Cluster',
    showInColumn: 1,
    description: 'Asset cluster',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.sla',
    label: 'SLA',
    showInColumn: 1,
    description: 'Asset SLA',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.tags',
    label: 'Tags',
    showInColumn: 1,
    description: 'Asset tags',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.scan_date',
    label: 'Scan Date',
    showInColumn: 1,
    description: 'Scan date',
  },

  {
    name: 'sourceSpecificMetadata.Airflow.properties.AccessControl',
    label: 'Access Control',
    showInColumn: 1,
    description: 'Access Control',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.catchup',
    label: 'Catchup',
    showInColumn: 2,
    description: 'Catchup',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.description',
    label: 'Description',
    showInColumn: 2,
    description: 'Description',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.dependsOnPast',
    label: 'Depends On Past',
    showInColumn: 2,
    description: 'Depends On Past',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.docMd',
    label: 'Doc Md',
    showInColumn: 2,
    description: 'Doc Md',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.downstreamTaskIdsL',
    label: 'Downstream Task IdsL',
    showInColumn: 2,
    description: 'Downstream Task IdsL',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.email',
    label: 'Email',
    showInColumn: 2,
    description: 'Registered email',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.executionTimeout',
    label: 'Execution Timeout',
    showInColumn: 2,
    description: 'Execution Timeout',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.fileloc',
    label: 'Fileloc',
    showInColumn: 2,
    description: 'Fileloc',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.isPausedUponCreation',
    label: 'Is Paused Upon Creation',
    showInColumn: 2,
    description: 'Is Paused Upon Creation',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.label',
    label: 'Label',
    showInColumn: 3,
    description: 'Label',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.outlets',
    label: 'Outlets',
    showInColumn: 3,
    description: 'Outlets',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.sla',
    label: 'Props SLA',
    showInColumn: 3,
    description: 'Props SLA',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.startDate',
    label: 'Start Date',
    showInColumn: 3,
    description: 'Asset start date',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.taskId',
    label: 'Task Id',
    showInColumn: 3,
    description: 'Asset task Id',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.timezone',
    label: 'Time Zone',
    showInColumn: 3,
    description: 'Time Zone',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.triggerRule',
    label: 'Trigger Rule',
    showInColumn: 3,
    description: 'Trigger Rule',
  },
  {
    name: 'sourceSpecificMetadata.Airflow.properties.waitForDownstream',
    label: 'Wait For Downstream',
    showInColumn: 3,
    description: 'Wait For Downstream',
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
  Airflow {
    cluster
    owner
    tags
    airflowURL
    datahubURN
  }
`;

const customQueryForDetailsPage = `
  Airflow {
    airflowURL
    datahubURN
    pipeline
    pipeline_job
    owner
    cluster
    sla
    tags
    scan_date
    properties {
      AccessControl
      catchup
      description
      dependsOnPast
      docMd
      downstreamTaskIdsL
      email
      executionTimeout
      fileloc
      isPausedUponCreation
      label
      outlets
      sla
      sql
      startDate
      taskId
      timezone
      triggerRule
      waitForDownstream
    }
  }
`;

export const AirflowConfig: DataSource = {
  id: '3',
  name: 'Airflow',
  showColumns: false,
  showPartitionColumns: false,
  showLineage: true,
  showLineageTable: false,
  showLineagePipeline: true,
  showLineageQuery: false,
  showLineageCloned: false,
  showLineageCW: false,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
