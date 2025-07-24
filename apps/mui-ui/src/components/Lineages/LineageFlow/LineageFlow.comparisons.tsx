import {
  VertexFlow,
  VertexRelationship,
} from 'components/GraphMap/GraphMap.types';
import { APINode, APIRelatedNode } from 'types/api.types';
import { RelationshipName } from 'types/entities.types';

export interface NodeFlowMatcherProps {
  relations: VertexRelationship;
  parentNode: VertexFlow;
  origin: APINode;
  target: APIRelatedNode;
  relationship: RelationshipName;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  edgeLabel?: string;
}

export interface NodeFlowPosition {
  x: number;
  y: number;
}

enum NodeFlowConnector {
  origin = 'origin',
  target = 'target',
}

const getRawParentId = (parentId: string) => {
  return parentId.split('|')[0];
};

export interface NodeFlowRelation {
  name: string;
  relations: VertexRelationship;
  parentNodeType: string;
  originType: string;
  relationship: string;
  targetType: string;
  comparisonId: NodeFlowConnector;
  edgeLabel?: string;
  connectorEdge: NodeFlowConnector; // This is the data to show in UI (Origin or Target)
}

const nodeFlowRelations: NodeFlowRelation[] = [
  {
    name: 'dataflowConsumedByDataset',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Dataflow',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'dataflowConsumesDataset',
    relations: 'parentOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'datasetUpstreamOfDataset',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Dataset',
    relationship: 'downstream_of',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'upstream of',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'datasetDownstreamOfDataset',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Dataset',
    relationship: 'downstream_of',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'upstream of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datasetProducesDataflow',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Dataflow',
    relationship: 'produces',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'produces',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'dataflowTriggersDataflow',
    relations: 'parentOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'triggers',
    targetType: 'Dataflow',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'triggered By',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'dataflowTriggeredByDataflow',
    relations: 'childOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'triggers',
    targetType: 'Dataflow',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'triggered By',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'dataflowProducesDataset',
    relations: 'childOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'produces',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'produces',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    // TODO: Temporal change while Backend is fixing the issue
    // Relation is childOf, changed to parentOf temporarily
    name: 'dataflowUpstreamOfDataflow',
    relations: 'parentOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'downstream_of',
    targetType: 'Dataflow',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'upstream of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    // TODO: Temporal change while Backend is fixing the issue
    // Relation is parentOf, changed to childOf temporarily
    name: 'dataflowDownstreamOfDataflow',
    relations: 'childOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'downstream_of',
    targetType: 'Dataflow',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'upstream of',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'fieldDerivedFromField',
    relations: 'parentOf',
    parentNodeType: 'Field',
    originType: 'Field',
    relationship: 'derived_from',
    targetType: 'Field',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'derived to',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'fieldDerivedFromRelatedField',
    relations: 'childOf',
    parentNodeType: 'Field',
    originType: 'Field',
    relationship: 'derived_from',
    targetType: 'Field',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'derived to',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'DatasetDerivedFromField',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Dataset',
    relationship: 'derived_from',
    targetType: 'Field',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'derived from',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'DatasetPartOfDataset',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Dataset',
    relationship: 'part_of',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'part of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'DatasetPartOfDataset',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Dataset',
    relationship: 'refers',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'referred by',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'DatasetPartOfDataset',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Dataset',
    relationship: 'refers',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'referred by',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'WidgetConsumesDataset',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Widget',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'WidgetConsumesDatasetParentWidget',
    relations: 'parentOf',
    parentNodeType: 'Widget',
    originType: 'Widget',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'WidgetPartOfDashboard',
    relations: 'childOf',
    parentNodeType: 'Widget',
    originType: 'Widget',
    relationship: 'part_of',
    targetType: 'Dashboard',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'part of',
    connectorEdge: NodeFlowConnector.target,
  },
  {
    name: 'DashboardPartOfWidget',
    relations: 'parentOf',
    parentNodeType: 'Dashboard',
    originType: 'Widget',
    relationship: 'part_of',
    targetType: 'Dashboard',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'part of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'DatasetConsumedByDashboard',
    relations: 'parentOf',
    parentNodeType: 'Dashboard',
    originType: 'Dashboard',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.target,
  },
  // Elements removed from Lineage but maintained here until revision (040125)
  /*   {
    name: 'datasetConsumedByDatajob',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Datajob',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datajobConsumesDataset',
    relations: 'childOf',
    parentNodeType: 'Datajob',
    originType: 'Datajob',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'consumes',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datasetProducedByDatajob',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Datajob',
    relationship: 'produces',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'produces',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datajobProducesDataset',
    relations: 'childOf',
    parentNodeType: 'Datajob',
    originType: 'Datajob',
    relationship: 'produces',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'produces by',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datasetProducesDatajob',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Datajob',
    relationship: 'produces',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'produces',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datajobUpstreamOfDatajob',
    relations: 'childOf',
    parentNodeType: 'Datajob',
    originType: 'Datajob',
    relationship: 'downstream_of',
    targetType: 'Datajob',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'upstream of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datasetConsumesDataflow',
    relations: 'childOf',
    parentNodeType: 'Dataset',
    originType: 'Dataflow',
    relationship: 'consumes',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.target,
    edgeLabel: 'consumed by',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datajobDownstreamOfDatajob',
    relations: 'parentOf',
    parentNodeType: 'Datajob',
    originType: 'Datajob',
    relationship: 'downstream_of',
    targetType: 'Datajob',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'upstream of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'datajobPartOfDataflow',
    relations: 'parentOf',
    parentNodeType: 'Datajob',
    originType: 'Datajob',
    relationship: 'part_of',
    targetType: 'Dataflow',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'has',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'dataflowHasDatajob',
    relations: 'childOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'part_of',
    targetType: 'Datajob',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'has',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'dataflowPartOfPipeline',
    relations: 'parentOf',
    parentNodeType: 'Dataflow',
    originType: 'Dataflow',
    relationship: 'part_of',
    targetType: 'Pipeline',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'has',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'fieldPartOfDataset',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Field',
    relationship: 'part_of',
    targetType: 'Dataset',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'part of',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'fieldDerivedFromDataset',
    relations: 'parentOf',
    parentNodeType: 'Dataset',
    originType: 'Field',
    relationship: 'derived_from',
    targetType: 'Field',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'derived to',
    connectorEdge: NodeFlowConnector.origin,
  },
  {
    name: 'pipelineHasDataflow',
    relations: 'childOf',
    parentNodeType: 'Pipeline',
    originType: 'Pipeline',
    relationship: 'part_of',
    targetType: 'Dataflow',
    comparisonId: NodeFlowConnector.origin,
    edgeLabel: 'has',
    connectorEdge: NodeFlowConnector.origin,
  },
  */
];

const verifyRelation = (
  relationObject: NodeFlowRelation,
  props: NodeFlowMatcherProps
): boolean => {
  return (
    props.relations === relationObject.relations &&
    props.parentNode.nodeType === relationObject.parentNodeType &&
    props.origin.__typename === relationObject.originType &&
    props.relationship === relationObject.relationship &&
    props.target.__typename === relationObject.targetType &&
    (relationObject.comparisonId === NodeFlowConnector.origin
      ? props.origin._id
      : props.target._id) === getRawParentId(props.parentNode.id)
  );
};

export const checkNodeRelationMatch = (props: NodeFlowMatcherProps) => {
  let foundNode = undefined;
  nodeFlowRelations.forEach(nodeElement => {
    if (verifyRelation(nodeElement, props)) {
      foundNode = nodeElement;
    }
  });
  return foundNode;
};
