import {
  VertexFlow,
  VertexRelationship,
} from 'components/GraphMap/GraphMap.types';
import { NodeTypeEnum, QueryTypeEnum } from 'utils/lineage.utils';
import { APINode, APIRelatedNode } from './api.types';
import { RelationshipName } from './entities.types';
import { Edge } from '@xyflow/react';

export interface NodeFlowDataNode {
  id?: string;
  label?: string;
  dataSource?: string;
  platform?: string;
  queryType?: QueryTypeEnum | NodeTypeEnum | undefined;
  nodeType?: QueryTypeEnum | NodeTypeEnum | undefined;
  parentId?: string;
  depth?: number;
  nodeSide?: VertexRelationship;
  isExpandedRight?: boolean;
  isExpandedLeft?: boolean;
  onExpandLeft?: (id: string, depth: number) => void;
  onExpandRight?: (id: string, depth: number) => void;
  onContractLeft?: (id: string, nodeSide: VertexRelationship) => void;
  onContractRight?: (id: string, nodeSide: VertexRelationship) => void;
  onHighlight?: (node: NodeFlowDataNode) => void;
  onDownloadNode?: (id: string) => void;
  expandedLeft?: boolean;
  expandedRight?: boolean;
  isHighlighted?: boolean;
  edgeLabel?: string;
  isDownloadActive?: boolean;
  fullPosition?: NodeFlowFullPosition;
  [key: string]: unknown;
}

export interface NodeFlowFullPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NodeFlowCustomData {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  width?: number;
  height?: number;
  data: NodeFlowDataNode;
  hidden?: boolean;
}

export interface EdgeFlowDataElement extends Edge {
  data: {
    label?: string;
  };
}

export interface NodeFlowContainer {
  nodeToShow: string;
  props: NodeFlowProps;
}

export interface NodeFlowProps {
  edgeId: string;
  relations: VertexRelationship;
  parentNode: VertexFlow;
  origin: APINode;
  target: APIRelatedNode;
  relationship: RelationshipName;
  edgeLabel?: string;
  nodeToShow?: string;
}
