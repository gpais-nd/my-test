import { APIEdge, APINode } from '../../../types/api.types';
import { NodeType } from '../../../types/entities.types';
import {
  extractNameFromId,
  getNodeDatasourceByAssetId,
  getS3PathBucket,
} from '../../../utils/urls.utils';
import { Vertex } from '../../GraphMap';
import { VertexRelationship } from '../../GraphMap/GraphMap.types';
import LineageVertexContent from './LineageVertexContent/LineageVertexContent';
import {
  NODE_HEIGHT,
  NODE_HEIGHT_WITH_DETAILS,
  NODE_WIDTH,
} from './LineageViewer';
import { DatasourcesEnum } from 'utils/datasources.utils';

const datasetUpstreamOfDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'downstream_of' &&
  apiEdge.node.__typename === 'Dataset' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;

const datasetDownstreamOfDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'downstream_of' &&
  apiEdge.node.__typename === 'Dataset' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.relatedNode._id === originVertex.id;

const datasetConsumedByDatajob = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'consumes' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.relatedNode._id === originVertex.id;

const datajobConsumesDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Datajob' &&
  apiEdge.relationship === 'consumes' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;

const datasetProducedByDatajob = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'produces' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;

const datajobProducesDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Datajob' &&
  apiEdge.relationship === 'produces' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;

const datasetProducesDatajob = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'produces' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.relatedNode._id === originVertex.id;

const datajobUpstreamOfDatajob = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Datajob' &&
  apiEdge.relationship === 'downstream_of' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Datajob' &&
  apiEdge.node._id === originVertex.id;

const datasetProducesDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'produces' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.relatedNode._id === originVertex.id;

const datasetConsumesDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'consumes' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.relatedNode._id === originVertex.id;

const dataflowTriggersDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'triggers' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataflow' &&
  apiEdge.node._id === originVertex.id;

const dataflowTriggeredByDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'triggers' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataflow' &&
  apiEdge.relatedNode._id === originVertex.id;

const datajobDownstreamOfDatajob = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Datajob' &&
  apiEdge.relationship === 'downstream_of' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Datajob' &&
  // apiEdge.relatedNode._id === originVertex.id;
  apiEdge.node._id === originVertex.id;

const datajobPartOfDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Datajob' &&
  apiEdge.relationship === 'part_of' &&
  apiEdge.node.__typename === 'Datajob' &&
  apiEdge.relatedNode.__typename === 'Dataflow' &&
  apiEdge.node._id === originVertex.id;

const dataflowHasDatajob = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'part_of' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Datajob' &&
  apiEdge.node._id === originVertex.id;

const dataflowPartOfPipeline = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'part_of' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Pipeline' &&
  apiEdge.node._id === originVertex.id;

const dataflowProducesDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'produces' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;

const dataflowConsumesDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'consumes' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;
const pipelineHasDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Pipeline' &&
  apiEdge.relationship === 'part_of' &&
  apiEdge.node.__typename === 'Pipeline' &&
  apiEdge.relatedNode.__typename === 'Dataflow' &&
  apiEdge.node._id === originVertex.id;

const dataflowUpstreamOfDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'childOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'downstream_of' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataflow' &&
  //apiEdge.node._id === originVertex.id;
  apiEdge.relatedNode._id === originVertex.id;

const dataflowDownstreamOfDataflow = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataflow' &&
  apiEdge.relationship === 'downstream_of' &&
  apiEdge.node.__typename === 'Dataflow' &&
  apiEdge.relatedNode.__typename === 'Dataflow' &&
  // apiEdge.relatedNode._id === originVertex.id;
  apiEdge.node._id === originVertex.id;

// Column Lineage
const fieldPartOfDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'part_of' &&
  apiEdge.node.__typename === 'Field' &&
  apiEdge.relatedNode.__typename === 'Dataset' &&
  apiEdge.node._id === originVertex.id;

const fieldDerivedFromDataset = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'derived_from' &&
  apiEdge.node.__typename === 'Field' &&
  apiEdge.relatedNode.__typename === 'Field' &&
  apiEdge.node._id === originVertex.id;
const datasetDerivedFromField = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Dataset' &&
  apiEdge.relationship === 'derived_from' &&
  apiEdge.node.__typename === 'Field' &&
  apiEdge.relatedNode.__typename === 'Field' &&
  apiEdge.relatedNode._id === originVertex.id;

const fieldDerivedFromField = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Field' &&
  apiEdge.relationship === 'derived_from' &&
  apiEdge.node.__typename === 'Field' &&
  apiEdge.relatedNode.__typename === 'Field' &&
  apiEdge.node._id === originVertex.id;

const fieldDerivedFromRelatedField = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdge: APIEdge
): boolean =>
  relationsToLoad === 'parentOf' &&
  originVertex.type === 'Field' &&
  apiEdge.relationship === 'derived_from' &&
  apiEdge.node.__typename === 'Field' &&
  apiEdge.relatedNode.__typename === 'Field' &&
  apiEdge.relatedNode._id === originVertex.id;

export const getSubVertices = (
  relationsToLoad: VertexRelationship,
  originVertex: Vertex,
  apiEdges: APIEdge[],
  showVertexDetails: boolean
): Vertex[] => {
  const level =
    relationsToLoad === 'childOf'
      ? originVertex.level + 1
      : originVertex.level - 1;

  const subVertices = apiEdges.reduce<Vertex[]>((acc, apiEdge) => {
    if (datasetUpstreamOfDataset(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      datasetDownstreamOfDataset(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      datasetConsumedByDatajob(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'consumed by'
        ),
      ];
    } else if (datajobConsumesDataset(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'consumes'
        ),
      ];
    } else if (
      datasetProducedByDatajob(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'produces'
        ),
      ];
    } else if (
      datasetProducesDataflow(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'produces'
        ),
      ];
    } else if (
      datasetConsumesDataflow(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'consumed by'
        ),
      ];
    } else if (
      dataflowTriggersDataflow(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'triggers'
        ),
      ];
    } else if (
      dataflowProducesDataset(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'produces'
        ),
      ];
    } else if (
      dataflowConsumesDataset(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'consumes'
        ),
      ];
    } else if (
      dataflowTriggeredByDataflow(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'triggered By'
        ),
      ];
    } else if (datajobProducesDataset(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'produces'
        ),
      ];
    } else if (datasetProducesDatajob(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(
          originVertex,
          apiEdge,
          level,
          showVertexDetails,
          'produces'
        ),
      ];
    } else if (fieldPartOfDataset(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      fieldDerivedFromDataset(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      datasetDerivedFromField(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (fieldDerivedFromField(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      fieldDerivedFromRelatedField(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      datajobUpstreamOfDatajob(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      datajobDownstreamOfDatajob(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (datajobPartOfDataflow(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, 'has'),
      ];
    } else if (dataflowHasDatajob(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, 'has'),
      ];
    } else if (dataflowPartOfPipeline(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, 'has'),
      ];
    } else if (pipelineHasDataflow(relationsToLoad, originVertex, apiEdge)) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, 'has'),
      ];
    } else if (
      dataflowUpstreamOfDataflow(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else if (
      dataflowDownstreamOfDataflow(relationsToLoad, originVertex, apiEdge)
    ) {
      return [
        ...acc,
        apiEdgeToVertex(originVertex, apiEdge, level, showVertexDetails, ''),
      ];
    } else {
      return [...acc];
    }
  }, []);

  return subVertices;
};

const apiEdgeToVertex = (
  originVertex: Vertex,
  apiEdge: APIEdge,
  level: number,
  showVertexDetails: boolean,
  relationshipLabel?: string
): Vertex => {
  const origin = apiEdge.node;
  const target = apiEdge.relatedNode;
  if (originVertex.id === origin._id) {
    return apiNodeToVertex(target, level, showVertexDetails, relationshipLabel);
  } else {
    return apiNodeToVertex(origin, level, showVertexDetails, relationshipLabel);
  }
};

const apiNodeToVertex = (
  apiNode: APINode,
  level: number,
  showVertexDetails: boolean,
  relationshipLabel?: string
): Vertex => {
  const nodeType: NodeType = apiNode.__typename as NodeType;
  const dataSourceNameByNodeId = getNodeDatasourceByAssetId(apiNode._id);

  const assetNameByDatasource =
    dataSourceNameByNodeId === DatasourcesEnum.Snowflake
      ? extractNameFromId(apiNode._id)
      : apiNode.name;

  return {
    id: apiNode._id,
    content: (
      <LineageVertexContent
        assetName={assetNameByDatasource ?? apiNode._id}
        dataSourceName={dataSourceNameByNodeId ?? DatasourcesEnum.DeltaLake}
        vertexAssetId={apiNode._id}
        nodeType={nodeType}
      />
    ),
    dataSourceName: dataSourceNameByNodeId ?? DatasourcesEnum.DeltaLake,
    level: level,
    type: nodeType,
    highLighted: false,
    groupId: getGroupId(apiNode, nodeType, level, relationshipLabel),
    groupLabel: getGroupName(apiNode, nodeType),
    targetLabel: relationshipLabel ?? '',
    geometry: {
      position: { x: 0, y: 0 },
      dimensions: {
        height: showVertexDetails ? NODE_HEIGHT_WITH_DETAILS : NODE_HEIGHT,
        width: NODE_WIDTH,
      },
    },
  };
};

const getGroupId = (
  apiNode: APINode,
  nodeType: NodeType,
  vertexLevel?: number,
  relationshipLabel?: string
): string => {
  let groupId = apiNode._id;

  if (nodeType === 'Datajob') {
    const regex = /:(\d+)\)/;
    const match = apiNode._id.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      // return getHost(apiNode._id);
      return `${apiNode._id}_[L${vertexLevel}]_[R:${relationshipLabel ?? ''}]`;
    }
  } else if (nodeType === 'Dataset') {
    const regex = /s3:([^)]*)/;
    const match = apiNode._id.match(regex);
    if (match && match[1]) {
      groupId = match[1];
    } else {
      groupId = getS3PathBucket(apiNode._id);
    }
  }
  return `${groupId}_[L${vertexLevel}]_[R:${relationshipLabel ?? ''}]`;
};

const getGroupName = (apiNode: APINode, nodeType: NodeType): string => {
  if (nodeType === 'Datajob') {
    const regex = /:(\d+)\)/;
    const match = apiNode._id.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      return getHost(apiNode._id);
    }
  } else if (nodeType === 'Dataset') {
    const regex = /s3:([^)]*)/;
    const match = apiNode._id.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      return getS3PathBucket(apiNode._id);
    }
  } else {
    // return '' + apiNode._id;
    return '';
  }
};

const getHost = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.host;
  } catch {
    return '';
  }
};
