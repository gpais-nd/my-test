import { ReactNode } from 'react';
import { NodeType } from '../../types/entities.types';
import { NodeTypeEnum, QueryTypeEnum } from 'utils/lineage.utils';

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface Geometry {
  position: Point;
  dimensions: Dimensions;
}

export interface GeometrySides {
  top: Point;
  right: Point;
  bottom: Point;
  left: Point;
}

export interface BoundingBox {
  topLeft: Point;
  bottomRight: Point;
}

export interface VerticesGroup {
  id: string;
  label: string;
  level: number;
  vertices: Vertex[];
  visibleVertices: number;
  geometry: Geometry;
  isPinned: boolean;
  isHighlighted: boolean;
  originLabel?: string;
  targetLabel?: string;
  dataSourceName?: string | undefined;
}

export interface ModifiedVerticesGroups {
  [groupId: string]: VerticesGroup;
}

export interface VertexDetail {
  name: string;
  value: string | undefined | null;
}

export type VertexRelationship =
  | 'childOf'
  | 'parentOf'
  | 'ancestorOf'
  | 'descendantOf';

export interface Vertex {
  id: string;
  content: ReactNode;
  level: number;
  geometry: Geometry;
  type: NodeType;
  index?: number;
  groupId?: string;
  groupLabel?: string;
  isRoot?: boolean;
  parents?: Vertex[];
  children?: Vertex[];
  parentsGroups?: VerticesGroup[];
  childrenGroups?: VerticesGroup[];
  parentsEdges?: Edge[];
  childrenEdges?: Edge[];
  areChildrenOpen?: boolean;
  areParentsOpen?: boolean;
  hideToggleButton?: boolean;
  originLabel?: string;
  targetLabel?: string;
  tooltip?: string;
  className?: string;
  showDetails?: boolean;
  details?: VertexDetail[];
  queryChildrenId?: string;
  queryParentsId?: string;
  dataSourceName?: string;
  highLighted?: boolean;
}

export interface EdgeReference {
  fromId: string;
  toId: string;
  fromLabel?: string;
  toLabel?: string;
}

export interface Edge {
  id: string;
  origin: Geometry;
  target: Geometry;
  originLabel?: string;
  targetLabel?: string;
}

export interface VertexFlowPosition {
  x: number;
  y: number;
}

export interface VertexFlow {
  id: string;
  label?: string;
  dataSource?: string;
  queryType: QueryTypeEnum;
  parentId?: string;
  groupId?: string;
  groupNodes?: VertexFlow[];
  tooltip?: string;
  showDetails?: boolean;
  details?: VertexDetail[];
  nodeType: string;
  onExpandLeft?: (id: string) => void;
  onExpandRight?: (id: string) => void;
  onContractLeft?: (id: string) => void;
  onContractRight?: (id: string) => void;
  expandedLeft?: boolean;
  expandedRight?: boolean;
  isHighlighted?: boolean;
}

export interface VertexFlowGroup {
  id: string;
  label?: string;
  dataSource?: string;
  queryType?: QueryTypeEnum;
  nodeType?: NodeTypeEnum;
  groupNodes: VertexFlow[];
  position?: VertexFlowPosition;
  edgeType?: string;
  deepLevel?: number;
  parentId?: string;
  isHighlighted?: boolean;
  onHighlight?: (id: VertexFlowGroup) => void;
}
