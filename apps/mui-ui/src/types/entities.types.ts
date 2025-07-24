import { ReactElement } from 'react';
import { LinkType } from 'components/Grid/GridPillLink/GridPillLink';
import { GridColumnHeader, SortDirection } from 'components/Grid/types';
import { CountingOption, Option } from 'components/Form/types';
import { GenericTypeWithId, Link } from './utils.types';

export interface Aggregation {
  name: string;
  options: CountingOption[];
}

export interface DataSource {
  id: string;
  name: string;
  numberOfTables?: number;
  showColumns?: boolean;
  showPartitionColumns?: boolean;
  showAutoUpdateGlueTableSwitch?: boolean;
  showLineage?: boolean;
  showLineageTable?: boolean;
  showLineageQuery?: boolean;
  showLineageCloned?: boolean;
  showLineageCW?: boolean;
  showLineageColumn?: boolean;
  showLineagePipeline?: boolean;
  gridHeaders?: GridColumnHeader[];
  attributesMap?: Attribute[];
  customQueryForListPage?: string;
  customQueryForDetailsPage?: string;
  label?: string;
  dataSourceLabel?: string;
  category?: string;
  glossary?: boolean;
  isEnabled?: boolean;
}

export interface Attribute {
  name: string;
  label: string;
  isEditable?: boolean;
  editableOnNull?: boolean;
  value?: string;
  type?:
    | 'string'
    | 'link'
    | 'boolean'
    | 'array'
    | 'emails'
    | 'commaSeparated'
    | 'code'
    | 'date'
    | 'list';
  separator?: ',' | ';';
  showInColumn?: number;
  linkTo?: string;
  linkText?: string;
  prefix?: string;
  suffix?: string;
  remoteSaveField?: string;
  editingOptions?: Option[];
  referenceLink?: Link | Link[];
  description?: string; // This field is used for glossary
}

interface TableLayer {
  label: string;
  icon: ReactElement;
}

export interface TableLayerTypes {
  gold: TableLayer;
  silver: TableLayer;
  bronze: TableLayer;
}

export interface TableUnusedAssetTypes {
  Red: TableLayer;
  Orange: TableLayer;
  Normal: TableLayer;
}

interface TableLink {
  label: string;
  url: string;
  key?: number;
  type?: LinkType;
}

type AssetType = 'table';

export interface AssetSummary {
  id: string;
  name: string;
}

export interface Asset {
  dataSource: string;
  businessMetadata: BusinessMetadata;
  sourceSpecificMetadata: SourceSpecificMetadata;
  technicalMetadata: TechnicalMetadata;
}

export interface BusinessMetadata {
  asset_id: string;
  asset_name: string;
  classification?: string | null;
  administrativeMetadata: {
    team?: string | null;
  };
  descriptiveMetadata: {
    description?: string | null;
  };
  owner?: string | null;
  app?: string | null;
}

export interface SourceSpecificMetadata {
  [key: string]: {
    unused_table_status: null;
    database_name: string;
    location?: string | null;
    location_href?: string | null;
    partition: string[];
    table_id?: string | null;
    columns: AssetColumn[];
    schema_name?: string | null;
    documentation?: string | null;
    layer?: string | null;
    glue_table_name?: string | null;
    unitycatalogue_table_name?: string | null;
    capacity_used?: string | null;
    depth?: string | null;
    input_format?: string | null;
    output_format?: string | null;
    is_partitioned?: string | null;
    compressed?: string | null;
    num_of_files?: number | null;
    num_of_partitions?: number | null;
    num_of_rows?: number | null;
    owner?: string | null;
    owner_type?: string | null;
    raw_data_size?: string | null;
    scan_date?: Date | null;
    last_ddl_time?: Date | null;
    partitionkeys?: string | null;
    modified_date?: Date | null;
    harmonyURL?: string | null;
    airflowURL?: string | null;
    datahubURN?: string | null;
    external_url?: string | null;
  };
}

export interface TechnicalMetadata {
  asset_age: number;
  asset_status?: string | null;
  asset_type: AssetType;
  created_by?: string | null;
  created_time?: Date | null;
  env: string;
  operationalMetadata: OperationalMetadata;
  securityAndComplianceMetadata: SecurityAndComplianceMetadata | null;
  usageMetadata: UsageMetadata | null;
}

interface OperationalMetadata {
  active_bytes?: number | null;
  est_monthly_cost?: number | null;
  source_control_url?: string | null;
  table_size?: string | null;
  vcs?: string | null;
}

interface SecurityAndComplianceMetadata {
  data_sensitivity?: string | null;
}

interface UsageMetadata {
  last_accessed: Date;
  last_accessed_age: number;
  top_queries: string[];
}

export interface AssetColumn {
  columnName: string;
  dataType: string;
  description?: string | null;
  default_value?: string | null;
  nullable: boolean;
  dataTypeDetails: string;
}

export type AssetRowValue = string | ReactElement | TableLink[] | TableLayer;

export interface AssetRowEntry extends GenericTypeWithId {
  [key: string]: AssetRowValue;
}

export interface TableColumn {
  id: string;
  name: string;
  type: string;
  comment?: string;
  dataTypeDetails?: string;
  lineageLink?: string;
}

export interface Condition {
  column: string;
  operator: '=' | '>' | '<' | '>=' | '<=';
  value: string;
}

export interface TableColumnElement
  extends Omit<TableColumn, 'comment' | 'type' | 'lineageLink'> {
  type: string | ReactElement;
  comment?: ReactElement;
  lineageLink?: ReactElement;
  collapsibleContent?: ReactElement;
}

export interface ColumnSortDirection {
  columnName: string;
  sortDirection: SortDirection;
}

export interface StructField {
  name?: string;
  type: string | StructField;
  fields?: StructField[];
  nullable?: boolean;
  metadata?: string;
}

interface NodeData {
  id: string;
  name: string;
  type: string;
  dataSource: string;
  database?: string | null;
  owner?: string;
  team?: string;
  critical?: string;
}

export interface Lineage {
  src: NodeData;
  dest: NodeData;
  relationType: string;
  executedUser?: string | null;
  executionTime?: string | null;
  cloneCount?: string | null;
}

export type NodeType =
  | 'Dataset'
  | 'Datajob'
  | 'Dataflow'
  | 'Pipeline'
  | 'Platform'
  | 'Compute'
  | 'Owner'
  | 'Field'
  | 'Dashboard'
  | 'Widget'
  | 'DataQuery'
  | 'Alert'
  | 'Incident'
  | 'MLRegistry'
  | 'MLModel';

export type RelationshipName =
  | 'hosted_on'
  | 'created_by'
  | 'downstream_of'
  | 'produces'
  | 'consumes'
  | 'ran_on'
  | 'part_of'
  | 'affects_dashboard'
  | 'refers'
  | 'triggered_by'
  | 'triggers'
  | 'caused_by_datajob'
  | 'affects_datajob'
  | 'caused_by_dataflow'
  | 'affects_dataflow'
  | 'affects_dashboard'
  | 'derived_from';
