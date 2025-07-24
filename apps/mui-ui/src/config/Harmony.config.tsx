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
    name: 'sourceSpecificMetadata.Harmony.harmonyURL',
    label: 'Harmony URL',
    width: '30%',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.owner',
    label: 'Owner',
    width: '20%',
  },
];

const attributesMap: Attribute[] = [
  {
    name: 'technicalMetadata.env',
    label: 'Environment',
    showInColumn: 0,
    description: 'Asset environment',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.harmonyURL',
    label: 'Harmony URL',
    type: 'link',
    showInColumn: 0,
    description: 'Harmony URL',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.datahubURN',
    label: 'Datahub URN',
    showInColumn: 0,
    description: 'Datahub URN',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.cluster',
    label: 'Cluster',
    showInColumn: 0,
    description: 'Harmony cluster',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.tags',
    label: 'Tags',
    showInColumn: 0,
    description: 'Tags added to this asset',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.owner',
    label: 'Owner',
    showInColumn: 0,
    description: 'Owner of this asset',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.scan_date',
    label: 'Scan Date',
    showInColumn: 0,
    description: 'Date when this asset was scanned',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.longRunningThreshold',
    label: 'Long Running Threshold',
    showInColumn: 0,
    description: 'Long Running Threshold',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.endDate',
    label: 'End Date',
    showInColumn: 0,
    description: 'Asset end date',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.timezone',
    label: 'Timezone',
    showInColumn: 1,
    description: 'Timezone',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.ordering',
    label: 'Ordering',
    showInColumn: 1,
    description: 'Ordering',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.taskMemoryInMb',
    label: 'Task Memory',
    suffix: ' MB',
    showInColumn: 1,
    description: 'Task memory in MB',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.sendMail',
    label: 'Send Mail',
    showInColumn: 1,
    description: 'Flag to show to send email',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.lastSequentialRun',
    label: 'Last Sequential Run',
    showInColumn: 1,
    description: 'Last Sequential Run',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.taskTimeoutInMinutes',
    label: 'Task Timeout',
    suffix: ' minutes',
    showInColumn: 1,
    description: 'Task timeout in minutes',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.enabled',
    label: 'Enabled',
    showInColumn: 1,
    description: 'Enabled',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.maxConcurrency',
    label: 'Max Concurrency',
    showInColumn: 1,
    description: 'Max Concurrency',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.delayCheckEnabled',
    label: 'Delay Check Enabled',
    showInColumn: 1,
    description: 'Delay Check Enabled',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.delayThreshold',
    label: 'Delay Threshold',
    showInColumn: 1,
    description: 'Delay Threshold',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.failureThreshold',
    label: 'Failure Threshold',
    showInColumn: 1,
    description: 'Failure Threshold',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.inputDataJobs',
    label: 'Input Data Jobs',
    showInColumn: 2,
    description: 'Input Data Jobs',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.failureCheckEnabled',
    label: 'Failure Check Enabled',
    showInColumn: 2,
    description: 'Failure Check Enabled',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.jobType',
    label: 'Job Type',
    showInColumn: 2,
    description: 'Job Type',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.operatorGroup',
    label: 'Operator Group',
    showInColumn: 2,
    description: 'Operator Group',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.email',
    label: 'Email',
    showInColumn: 2,
    description: 'Email',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.owner',
    label: 'Owner',
    showInColumn: 2,
    description: 'Owner',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.yellowPagesService',
    label: 'Yellow Pages Service',
    showInColumn: 2,
    description: 'Yellow Pages Service',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.sla',
    label: 'SLA',
    showInColumn: 2,
    description: 'SLA',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.mailList',
    label: 'Mail List',
    showInColumn: 2,
    description: 'Mail List',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.failureCheckTimePeriod',
    label: 'Failure Check Time Period',
    showInColumn: 2,
    description: 'Failure Check Time Period',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.priority',
    label: 'Priority',
    showInColumn: 2,
    description: 'Priority',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.jobId',
    label: 'Job Id',
    showInColumn: 2,
    description: 'Job Id',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.maxRetry',
    label: 'Max Retry',
    showInColumn: 3,
    description: 'Max Retry',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.startDateTime',
    label: 'Start Date Time',
    showInColumn: 3,
    description: 'Start Date Time',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.deleted',
    label: 'Deleted',
    showInColumn: 3,
    description: 'Deleted',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.longRunningCheckEnabled',
    label: 'Long Running Check Enabled',
    showInColumn: 3,
    description: 'Long Running Check Enabled',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.externalJobId',
    label: 'External Job Id',
    showInColumn: 3,
    description: 'External Job Id',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.interval',
    label: 'Interval',
    showInColumn: 3,
    description: 'Interval',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.bash',
    label: 'Bash',
    type: 'code',
    showInColumn: 3,
    description: 'Bash',
  },
  {
    name: 'sourceSpecificMetadata.Harmony.properties.ypServiceId',
    label: 'YP Service Id',
    showInColumn: 3,
    description: 'YP Service Id',
  },
  {
    name: 'technicalMetadata.operationalMetadata.vcs',
    label: 'Version Control',
    type: 'link',
    showInColumn: 3,
    description: 'Version Control',
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
  Harmony {
    harmonyURL
    cluster
    datahubURN
    owner
  }
`;

const customQueryForDetailsPage = `
  Harmony {
    harmonyURL
    datahubURN
    cluster
    owner
    tags
    scan_date
    properties {
      longRunningThreshold
      endDate
      timezone
      ordering
      taskMemoryInMb
      sendMail
      lastSequentialRun
      taskTimeoutInMinutes
      enabled
      maxConcurrency
      delayCheckEnabled
      delayThreshold
      failureThreshold
      inputDataJobs
      failureCheckEnabled
      jobType
      operatorGroup
      email
      owner
      yellowPagesService
      sla
      mailList
      failureCheckTimePeriod
      priority
      jobId
      maxRetry
      startDateTime
      deleted
      longRunningCheckEnabled
      externalJobId
      name
      interval
      bash
      ypServiceId
    }
  }
`;

export const HarmonyConfig: DataSource = {
  id: '5',
  name: 'Harmony',
  showLineage: true,
  showLineageTable: true,
  showLineagePipeline: false,
  showLineageQuery: false,
  showLineageCloned: false,
  showLineageCW: false,
  showLineageColumn: false,
  showColumns: false,
  showPartitionColumns: false,
  gridHeaders,
  attributesMap,
  customQueryForListPage,
  customQueryForDetailsPage,
  glossary: false,
};
