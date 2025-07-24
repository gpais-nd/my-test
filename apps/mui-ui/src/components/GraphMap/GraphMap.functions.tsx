import {
  Geometry,
  Point,
  Edge,
  Vertex,
  VerticesGroup,
  GeometrySides,
  ModifiedVerticesGroups,
  VertexRelationship,
} from './GraphMap.types';

export const WORKSPACE_WIDTH = 100000;
export const WORKSPACE_HEIGHT = 80000;
export const INITIAL_SCALE = 2;
export const MIN_SCALE = 0.05;
export const MAX_SCALE = 20;
export const WHEEL_STEP = 0.1;

const VERTICAL_ROOT_NODES_SPACE = 60;

export const GROUP_DEFAULT_VISIBLE_VERTICES = 5;
export const GROUP_EXTRA_VERTICES_ON_VIEW_MORE = 5;
const GROUP_DEFAULT_HEIGHT = 88;
const GROUP_DEFAULT_WIDTH = 230;
export const GROUP_HORIZONTAL_SPACE = 74;
export const GROUP_VERTICAL_SPACE = 5;

export const VERTEX_DETAILS_HEIGHT = 83;

export const LINE_BASE_COLOR = '#71AFC0';
export const MIN_LINE_GAP = 30;
export const LINE_RADIUS = 11;
export const LINE_OFFSET_BY_TOGGLE_BUTTON = 5;
export const LINE_LABEL_H_OFFSET = 16;
export const LINE_LABEL_V_OFFSET = 5;

const initialGeometry: Geometry = {
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    height: 0,
    width: 0,
  },
};

export const getInitialX = (
  vertices: Vertex[],
  viewportWidth: number
): number => {
  const vertexWidth =
    vertices.length > 0 && vertices[0].geometry.dimensions.width
      ? vertices[0].geometry.dimensions.width / 2
      : 0;
  return -WORKSPACE_WIDTH + viewportWidth / 2 - vertexWidth * INITIAL_SCALE;
};

export const getInitialY = (
  vertices: Vertex[],
  viewportHeight: number
): number => {
  const vertexHeight =
    vertices.length > 0 && vertices[0].geometry.dimensions.height
      ? vertices[0].geometry.dimensions.height / 2
      : 0;
  return -WORKSPACE_HEIGHT + viewportHeight / 2 - vertexHeight * INITIAL_SCALE;
};

const getGroupHeight = (
  verticesGroup: VerticesGroup,
  initialValue = false
): number => {
  const verticesHeight = verticesGroup.vertices
    .slice(
      0,
      initialValue
        ? GROUP_DEFAULT_VISIBLE_VERTICES
        : verticesGroup.visibleVertices
    )
    .reduce<number>(
      (acc, vertex) => acc + vertex.geometry.dimensions.height,
      0
    );

  return GROUP_DEFAULT_HEIGHT + verticesHeight;
};

export const locateRootVertices = (vertices: Vertex[]): Vertex[] =>
  vertices.map((vertex, index) => {
    const yDisplace =
      index * (vertex.geometry.dimensions.height + VERTICAL_ROOT_NODES_SPACE);

    return {
      ...vertex,
      geometry: {
        ...vertex.geometry,
        position: {
          x: WORKSPACE_WIDTH / 2 - vertex.geometry.dimensions.width / 2,
          y: WORKSPACE_HEIGHT / 2 - yDisplace,
        },
      },
    };
  });

const verifyPositions = (groupGeometry: Geometry) => {
  const newPosition = checkAndAdjustOverlap(
    groupGeometry.position.x,
    groupGeometry.position.y
  );
  return newPosition;
};

export const locateSubVertices = (vertices: Vertex[]): Vertex[] =>
  vertices.map(vertex => {
    let locatedChildrenGroups = vertex.childrenGroups
      ? locateGroups(vertex.geometry, vertex.childrenGroups, 'childOf')
      : undefined;
    const locatedParentsGroups = vertex.parentsGroups
      ? locateGroups(vertex.geometry, vertex.parentsGroups, 'parentOf')
      : undefined;
    return {
      ...vertex,
      childrenGroups: locatedChildrenGroups?.map(group => {
        return {
          ...group,
          vertices: locateSubVertices(group.vertices),
        };
      }),
      childrenEdges: locatedChildrenGroups
        ? getEdges(vertex, locatedChildrenGroups)
        : [],
      parentsGroups: locatedParentsGroups?.map(group => {
        return {
          ...group,
          vertices: locateSubVertices(group.vertices),
        };
      }),
      parentsEdges: locatedParentsGroups
        ? getEdges(vertex, locatedParentsGroups)
        : [],
    };
  });
const checkAndAdjustOverlap = (newX: number, newY: number) => {
  // Convertimos el objeto a un array para facilitar su procesamiento
  const currentGroups = JSON.parse(localStorage.getItem('nodes') || '');
  const objects = Object.values(currentGroups) as Geometry[];
  let adjustedY = newY;

  for (const obj of objects) {
    const objTop = obj?.position.y;
    const objBottom = obj?.position.y + obj?.dimensions.height;
    const objLeft = obj?.position.x;
    const objRight = obj?.position.x + obj?.dimensions.width;

    if (adjustedY > objTop && adjustedY < objBottom) {
      if (newX >= objLeft && newX <= objRight) {
        adjustedY = objBottom + 10;
      }
    }
  }

  return {
    x: newX,
    y: adjustedY,
  };
};
const locateGroups = (
  originGeometry: Geometry,
  groups: VerticesGroup[],
  relationsToLoad: VertexRelationship
): VerticesGroup[] => {
  let totalGroupsHeight = 0;

  const groupsWithDimensions = groups.map<VerticesGroup>(group => {
    const height = getGroupHeight(group);
    totalGroupsHeight += getGroupHeight(group, true) + GROUP_VERTICAL_SPACE;
    return {
      ...group,
      geometry: {
        ...group.geometry,
        dimensions: {
          height,
          width: GROUP_DEFAULT_WIDTH,
        },
      },
    };
  });

  let currentGroupY =
    originGeometry.position.y +
    originGeometry.dimensions.height / 2 -
    totalGroupsHeight / 2;

  return groupsWithDimensions.map<VerticesGroup>(group => {
    const elementOffset =
      relationsToLoad === 'childOf'
        ? originGeometry.dimensions.width
        : group.geometry.dimensions.width;
    const xOffset =
      (relationsToLoad === 'childOf' ? 1 : -1) *
      (elementOffset + GROUP_HORIZONTAL_SPACE);

    const x = originGeometry.position.x + xOffset;

    const y = currentGroupY;
    currentGroupY += group.geometry.dimensions.height + GROUP_VERTICAL_SPACE;

    const groupGeometry: Geometry = {
      ...group.geometry,
      position: { x, y },
    };

    groupGeometry.position = verifyPositions(groupGeometry);
    return {
      ...group,
      geometry: groupGeometry,
      vertices: locateVerticesInGroup(groupGeometry, group.vertices),
    };
  });
};

const locateVerticesInGroup = (
  groupGeometry: Geometry,
  vertices: Vertex[]
): Vertex[] =>
  vertices.map((vertex, index) => ({
    ...vertex,
    geometry: {
      ...vertex.geometry,
      position: {
        x: groupGeometry.position.x,
        y:
          groupGeometry.position.y +
          GROUP_DEFAULT_HEIGHT -
          vertex.geometry.dimensions.height / 2 +
          index * vertex.geometry.dimensions.height -
          11,
      },
    },
  }));

export const filterByGroup = (
  vertices?: Vertex[],
  groupNames?: string[]
): Vertex[] => {
  if (!vertices) {
    return [];
  }

  const filtered = vertices.reduce<Vertex[]>((acc, vertex) => {
    if (
      vertex.groupLabel &&
      groupNames &&
      !groupNames.includes(vertex.groupLabel)
    ) {
      const filteredChildren = filterByGroup(vertex.children ?? [], groupNames);

      const filteredParents = filterByGroup(vertex.parents ?? [], groupNames);

      return [
        ...acc,
        {
          ...vertex,
          children: filteredChildren,
          parents: filteredParents,
          areChildrenOpen: filteredChildren.length > 0,
          areParentsOpen: filteredParents.length > 0,
        },
      ];
    } else {
      return [...acc];
    }
  }, []);

  return filtered;
};

const createGroups = (
  verticesToGroup: Vertex[],
  modifiedVerticesGroups: ModifiedVerticesGroups = {}
): VerticesGroup[] => {
  let newVerticesGroups: VerticesGroup[] = [];

  verticesToGroup.forEach(vertex => {
    if (vertex.groupId) {
      if (newVerticesGroups.find(vg => vg.id === vertex.groupId)) {
        newVerticesGroups.forEach(vg => {
          if (vg.id === vertex.groupId) {
            vg.vertices?.push(vertex);
          }
        });
      } else {
        if (modifiedVerticesGroups[vertex.groupId]) {
          const existing = modifiedVerticesGroups[vertex.groupId];
          newVerticesGroups.push({
            id: vertex.groupId,
            label: vertex.groupLabel ?? vertex.groupId,
            level: vertex.level,
            vertices: [vertex],
            dataSourceName: vertex.dataSourceName,
            geometry: initialGeometry,
            isPinned: existing.isPinned,
            isHighlighted: existing.isHighlighted,
            visibleVertices: existing.visibleVertices,
          });
        } else {
          newVerticesGroups.push({
            id: vertex.groupId,
            label: vertex.groupLabel ?? vertex.groupId,
            level: vertex.level,
            vertices: [vertex],
            dataSourceName: vertex.dataSourceName,
            visibleVertices: GROUP_DEFAULT_VISIBLE_VERTICES,
            geometry: initialGeometry,
            isPinned: false,
            isHighlighted: false,
          });
        }
      }
    }
  });

  return newVerticesGroups;
};

export const groupSubVertices = (
  verticesToGroup: Vertex[],
  modifiedVerticesGroups: ModifiedVerticesGroups = {}
): Vertex[] => {
  verticesToGroup.forEach(vertex => {
    if (vertex.children) {
      const childrenGroups = createGroups(
        vertex.children,
        modifiedVerticesGroups
      );
      vertex.childrenGroups = childrenGroups.map(group => ({
        ...group,
        originLabel: group.vertices[0].originLabel,
        targetLabel: group.vertices[0].targetLabel,
        vertices: groupSubVertices(group.vertices, modifiedVerticesGroups),
      }));
    }
    if (vertex.parents) {
      const parentsGroups = createGroups(
        vertex.parents,
        modifiedVerticesGroups
      );
      vertex.parentsGroups = parentsGroups.map(group => ({
        ...group,
        originLabel: group.vertices[0].originLabel,
        targetLabel: group.vertices[0].targetLabel,
        vertices: groupSubVertices(group.vertices, modifiedVerticesGroups),
      }));
    }
  });

  return [...verticesToGroup];
};

export const updateVerticesGroup = (
  vertices: Vertex[],
  verticesGroup: VerticesGroup
): Vertex[] =>
  vertices.map(v => ({
    ...v,
    childrenGroups: v.childrenGroups
      ? v.childrenGroups.map(vg =>
          vg.id === verticesGroup.id
            ? { ...verticesGroup }
            : {
                ...vg,
                vertices: updateVerticesGroup(vg.vertices, verticesGroup),
              }
        )
      : [],
    parentsGroups: v.parentsGroups
      ? v.parentsGroups.map(vg =>
          vg.id === verticesGroup.id
            ? { ...verticesGroup }
            : {
                ...vg,
                vertices: updateVerticesGroup(vg.vertices, verticesGroup),
              }
        )
      : [],
  }));

export const searchVertex = (
  vertices: Vertex[],
  vertexId: string
): Vertex | undefined => {
  const vertex = vertices.reduce<Vertex | undefined>((acc, v) => {
    if (v.id === vertexId && !acc) {
      return { ...v };
    } else if (v.children && v.areChildrenOpen && !acc) {
      return searchVertex(v.children, vertexId);
    }
    return acc;
  }, undefined);
  return vertex;
};

export const searchVertexInGroups = (
  vertices: Vertex[],
  vertexId: string
): Vertex | undefined => {
  const sibling = vertices.find(sibling => sibling.id === vertexId);
  if (sibling) {
    return sibling;
  }

  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    if (vertex.childrenGroups) {
      for (let j = 0; j < vertex.childrenGroups.length; j++) {
        const found = searchVertexInGroups(
          vertex.childrenGroups[j].vertices,
          vertexId
        );
        if (found) {
          i = vertices.length;
          j = vertex.childrenGroups.length;
          return found;
        }
      }
    }

    if (vertex.parentsGroups) {
      for (let j = 0; j < vertex.parentsGroups.length; j++) {
        const found = searchVertexInGroups(
          vertex.parentsGroups[j].vertices,
          vertexId
        );
        if (found) {
          i = vertices.length;
          j = vertex.parentsGroups.length;
          return found;
        }
      }
    }
  }
};

export const getSiblingsInGroup = (
  vertices: Vertex[],
  vertexId: string
): Vertex[] => {
  let siblings: Vertex[] = [];
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    if (vertex.childrenGroups) {
      for (let j = 0; j < vertex.childrenGroups.length; j++) {
        const group = vertex.childrenGroups[j];
        for (let k = 0; k < group.vertices.length; k++) {
          const subVertex = group.vertices[k];
          if (subVertex.id === vertexId) {
            i = vertices.length;
            j = vertex.childrenGroups.length;
            k = group.vertices.length;
            siblings = group.vertices.filter(v => v.id !== vertexId);
          }
        }
      }
    }

    if (vertex.parentsGroups) {
      for (let j = 0; j < vertex.parentsGroups.length; j++) {
        const group = vertex.parentsGroups[j];
        for (let k = 0; k < group.vertices.length; k++) {
          const subVertex = group.vertices[k];
          if (subVertex.id === vertexId) {
            i = vertices.length;
            j = vertex.parentsGroups.length;
            k = group.vertices.length;
            siblings = group.vertices.filter(v => v.id !== vertexId);
          }
        }
      }
    }
  }

  return siblings;
};

export const unifyGroupNames = (verticesGroups: VerticesGroup[]): string[] =>
  [...new Set(verticesGroups.map(g => g.label))].sort((a, b) =>
    a < b ? -1 : 1
  );

export const hasChildrenOrParents = (vertices: Vertex[]): boolean => {
  const numberOfNodes: number = vertices.reduce(
    (acc, vertex) =>
      acc + (vertex.children?.length ?? 0) + (vertex.parents?.length ?? 0),
    0
  );

  return numberOfNodes > 0;
};

export const getEdgeId = (
  from: Vertex | VerticesGroup,
  to: Vertex | VerticesGroup
): string => `${from.id}=>${to.id}`;

export const getEdges = (
  origin: Vertex | VerticesGroup,
  locatedGroups: VerticesGroup[]
): Edge[] =>
  locatedGroups.map<Edge>(group => ({
    id: getEdgeId(origin, group),
    origin: origin.geometry,
    target: group.geometry,
    originLabel: group.originLabel,
    targetLabel: group.targetLabel,
  }));

export const zeroPoint: Point = { x: 0, y: 0 };

export const getGeometryCenter = (geometry: Geometry): Point => ({
  x: geometry.position.x + geometry.dimensions.width / 2,
  y: geometry.position.y + geometry.dimensions.height / 2,
});

export const getGeometryMiddleTop = (geometry: Geometry): Point => ({
  x: geometry.position.x + geometry.dimensions.width / 2,
  y: geometry.position.y,
});

export const getGeometryMiddleRight = (geometry: Geometry): Point => ({
  x: geometry.position.x + geometry.dimensions.width,
  y: geometry.position.y + geometry.dimensions.height / 2,
});

export const getGeometryMiddleBottom = (geometry: Geometry): Point => ({
  x: geometry.position.x + geometry.dimensions.width / 2,
  y: geometry.position.y + geometry.dimensions.height,
});

export const getGeometryMiddleLeft = (geometry: Geometry): Point => ({
  x: geometry.position.x,
  y: geometry.position.y + geometry.dimensions.height / 2,
});

export const getGeometrySides = (geometry: Geometry): GeometrySides => ({
  top: getGeometryMiddleTop(geometry),
  right: getGeometryMiddleRight(geometry),
  bottom: getGeometryMiddleBottom(geometry),
  left: getGeometryMiddleLeft(geometry),
});
