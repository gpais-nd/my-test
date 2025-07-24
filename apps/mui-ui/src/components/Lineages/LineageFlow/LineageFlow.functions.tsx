import {
  NodeFlowMatcherProps,
  NodeFlowPosition,
  NodeFlowRelation,
  checkNodeRelationMatch,
} from './LineageFlow.comparisons';
import { NODE_HEIGHT, NODE_WIDTH } from '../LineageViewer/LineageViewer';
import {
  VertexFlow,
  VertexRelationship,
} from 'components/GraphMap/GraphMap.types';
import { APIEdge, APINode, APIRelatedNode } from 'types/api.types';
import {
  NodeFlowContainer,
  NodeFlowProps,
  NodeFlowCustomData,
  NodeFlowDataNode,
  NodeFlowFullPosition,
} from 'types/flow.types';
import { NodeTypeEnum } from 'utils/lineage.utils';
import { getPlatformById } from 'utils/urls.utils';
import { DatasourcesEnum } from 'utils/datasources.utils';

const NODE_OFFSET_X = 80;
const NODE_OFFSET_Y = 40;
export const ROOT_NODE_SIZE = {
  width: 235,
  height: 40,
};
const NODE_SIZE = {
  width: 210,
  height: 25,
};
export const ROOT_NODE_POSITION = {
  x: 0,
  y: 0,
};

export const getRawId = (id: string) => {
  return id.split('|')[0];
};

export interface NodeFlowFunctions {
  onExpandLeft?: (id: string, deepLevel: number) => void;
  onExpandRight?: (id: string, deepLevel: number) => void;
  onContractLeft?: (id: string, nodeSide: VertexRelationship) => void;
  onContractRight?: (id: string, nodeSide: VertexRelationship) => void;
  onDownloadNode?: (id: string) => void;
  onHighlight?: (node: NodeFlowDataNode) => void;
}

export const findAncestors = (
  nodes: NodeFlowCustomData[],
  nodeId: string,
  ancestors: Set<string> = new Set()
): Set<string> => {
  const node = nodes.find(n => n.id === nodeId);
  if (!node || !node.data.parentId) return ancestors;

  ancestors.add(node.data.parentId as string);
  return findAncestors(nodes, node.data.parentId as string, ancestors);
};

const getNameByDataSource = (
  dataSource: string,
  nodeProps: NodeFlowMatcherProps,
  nodeToShow: string
) => {
  const nodeName = (nodeProps as any)[nodeToShow]._id.split(':');
  const platform = getPlatformById((nodeProps as any)[nodeToShow]._id);
  if ((nodeProps as any)[nodeToShow].__typename === 'Field') {
    return `${nodeName[nodeName.length - 2]}${nodeName[nodeName.length - 1]}`;
  }
  if (platform.toLowerCase() === 'glue') {
    return `${nodeName[nodeName.length - 1]}`;
  }
  if (
    dataSource.toLocaleLowerCase() ===
      DatasourcesEnum.Snowflake.toLocaleLowerCase() ||
    dataSource.toLocaleLowerCase() ===
      DatasourcesEnum.Airflow.toLocaleLowerCase()
  ) {
    return nodeName[nodeName.length - 1];
  }

  return (nodeProps as any)[nodeToShow].name;
};

const addNode = (
  nodeSide: VertexRelationship,
  nodeProps: NodeFlowMatcherProps,
  parent: NodeFlowCustomData,
  totalNodes: number,
  index: number,
  randomId: number,
  nodeToShow: string,
  nodeFunctions: NodeFlowFunctions,
  edgeLabel: string,
  position: NodeFlowPosition,
  dataSource: DatasourcesEnum
) => {
  const platform = getPlatformById((nodeProps as any)[nodeToShow]._id);
  const deepLevel = parent.data.depth ? parent.data.depth + 1 : 1;
  const idToShow =
    nodeToShow === 'origin' ? nodeProps.origin._id : nodeProps.target._id;
  const uniqueId = `${idToShow}|${deepLevel}|${randomId}`;

  const positionY = index === 0 ? position.y : position.y + NODE_HEIGHT * index;
  const originalPosition = {
    x: position.x,
    y: positionY,
  };

  const newNode: NodeFlowCustomData = {
    id: uniqueId,
    type: 'customNode',
    width: NODE_SIZE.width,
    height: NODE_SIZE.height,
    position: originalPosition,
    data: {
      id: uniqueId,
      label: getNameByDataSource(platform as string, nodeProps, nodeToShow),
      dataSource: platform as string | undefined,
      isHighlighted: false,
      parentId: parent.id,
      nodeSide,
      depth: deepLevel,
      edgeLabel,
      queryType: (nodeProps as any)[nodeToShow].__typename as NodeTypeEnum,
      nodeType: (nodeProps as any)[nodeToShow].__typename as NodeTypeEnum,
      isDownloadActive: dataSource === DatasourcesEnum.Airflow ? false : true,
      isSelected: false,
      isExpandedLeft: false,
      isExpandedRight: false,
      onExpandLeft: nodeFunctions.onExpandLeft,
      onExpandRight: nodeFunctions.onExpandRight,
      onContractLeft: nodeFunctions.onContractLeft,
      onContractRight: nodeFunctions.onContractRight,
      onDownloadNode: nodeFunctions.onDownloadNode,
      onHighlight: nodeFunctions.onHighlight,
    },
  };
  return newNode;
};

const verifyOverlappingInX = (node1X: number, node2X: number) => {
  const x1 = node1X;
  const x2 = node1X + NODE_WIDTH;
  const x3 = node2X;
  const x4 = node2X + NODE_WIDTH;
  return (x1 >= x3 && x1 <= x4) || (x2 >= x3 && x2 <= x4);
};

const getGroupNodesInitialPosition = (
  parentNodePosition: NodeFlowPosition,
  currentNodesPositions: NodeFlowFullPosition[],
  nodeSide: VertexRelationship,
  totalNodes: number
) => {
  const totalOffset = (totalNodes - 1) * NODE_OFFSET_Y;
  const totalNodesHeight = totalNodes * NODE_HEIGHT;
  const totalHeight = totalNodesHeight + totalOffset;
  let initialPositionY = parentNodePosition.y;
  let positionX = parentNodePosition.x + NODE_WIDTH + NODE_OFFSET_X;

  if (nodeSide === 'parentOf') {
    positionX = parentNodePosition.x - NODE_WIDTH - NODE_OFFSET_X;
  }
  const nodesX = currentNodesPositions.filter(node =>
    verifyOverlappingInX(positionX, node.x)
  );
  const maxY =
    nodesX.length === 0 ? 0 : Math.max(...nodesX.map(node => node.y));
  const maxX = Math.max(...nodesX.map(node => node.x));

  if (maxY === 0) {
    initialPositionY = parentNodePosition.y - totalHeight / 4;
  }

  if (verifyOverlappingInX(positionX, maxX)) {
    return {
      x: positionX,
      y: maxY + NODE_OFFSET_Y,
    };
  } else {
    return {
      x: positionX,
      y: initialPositionY,
    };
  }
};

export const makeNodes = (
  apiNodes: APIEdge[],
  nodeSide: VertexRelationship,
  parent: NodeFlowCustomData,
  nodeFunctions: NodeFlowFunctions,
  nodesPositions: NodeFlowFullPosition[],
  dataSource: DatasourcesEnum
) => {
  let loadedNodes: NodeFlowCustomData[] = [];
  let totalNodes = 0;
  const nodesToProcess: NodeFlowContainer[] = [];

  apiNodes.forEach(apiNode => {
    const origin: APINode = apiNode.node;
    const target: APIRelatedNode = apiNode.relatedNode;
    const relationship = apiNode.relationship;
    const relations = nodeSide;
    const parentNode: VertexFlow = parent.data as unknown as VertexFlow;
    const edgeId = apiNode.edgeId.toString();
    const nodeProps: NodeFlowProps = {
      edgeId,
      relations,
      parentNode,
      origin,
      target,
      relationship,
      edgeLabel: '',
    };

    const foundNode: NodeFlowRelation | undefined =
      checkNodeRelationMatch(nodeProps);

    if (foundNode) {
      const nodeToShow = (foundNode as NodeFlowRelation).connectorEdge;
      nodeProps.nodeToShow = nodeToShow;
      nodeProps.edgeLabel = (foundNode as NodeFlowRelation).edgeLabel;
      nodesToProcess.push({ nodeToShow: nodeToShow, props: nodeProps });
    }
  });
  totalNodes = nodesToProcess.length;
  let nodePosition = getGroupNodesInitialPosition(
    parent.position,
    nodesPositions,
    nodeSide,
    totalNodes
  );
  if (totalNodes > 0) {
    nodesToProcess.forEach((nodeFlow, index) => {
      const randomId = Math.floor(Math.random() * 1000);
      const addedNode = addNode(
        nodeSide,
        nodeFlow.props,
        parent,
        totalNodes,
        index,
        randomId,
        nodeFlow.props.nodeToShow || 'origin',
        nodeFunctions,
        nodeFlow.props.edgeLabel || '',
        nodePosition,
        dataSource
      );
      loadedNodes.push(addedNode);
    });
  }
  return { nodes: loadedNodes };
};
