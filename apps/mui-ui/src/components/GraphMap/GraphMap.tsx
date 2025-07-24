import { FC, Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SelectChangeEvent } from '@mui/material';
import VertexNode from './VertexNode/VertexNode';
import VertexNodeGroup from './VertexNodeGroup/VertexNodeGroup';
import {
  Point,
  Edge,
  Vertex,
  EdgeReference,
  VerticesGroup,
  ModifiedVerticesGroups,
} from './GraphMap.types';
import {
  WORKSPACE_HEIGHT,
  WORKSPACE_WIDTH,
  INITIAL_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  WHEEL_STEP,
  getInitialX,
  getInitialY,
  groupSubVertices,
  locateRootVertices,
  locateSubVertices,
  searchVertexInGroups,
  getEdgeId,
  updateVerticesGroup,
  GROUP_EXTRA_VERTICES_ON_VIEW_MORE,
  getSiblingsInGroup,
} from './GraphMap.functions';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateGraphMapGroupsFilter,
  updateHighlighted,
} from '../../sideEffects/actions/app.actions';
import { RootState } from '../../sideEffects/reducers';
import GraphMapTools from './GraphMapTools/GraphMapTools';
import GraphMapLegend from './GraphMapLegend/GraphMapLegend';
import styles from './GraphMap.module.scss';
import EdgeLineArrow from './EdgeLine/EdgeLineArrow';
import EdgeLine from './EdgeLine/EdgeLine';

export interface GraphMapProps {
  vertices: Vertex[];
  edgeReferences?: EdgeReference[];
  autoArrange?: boolean;
  hideToggleButtons?: boolean;
  loading?: boolean;
  hideChildrenTooltip?: string;
  showChildrenTooltip?: string;
  hideParentsTooltip?: string;
  showParentsTooltip?: string;
  showChildrenButton?: boolean;
  showParentsButton?: boolean;
  showGrouping?: boolean;
  legend?: ReactElement;
  availableViewportHeight: number;
  customTools?: ReactElement[];
  graphScale?: number;
  showGroupsHeader?: boolean;
  showNodesAsSingle?: boolean;
  onOpenChildren?: (vertex: Vertex) => Promise<boolean>;
  onCloseChildren?: (vertex: Vertex) => Promise<boolean>;
  onOpenParents?: (vertex: Vertex) => Promise<boolean>;
  onCloseParents?: (vertex: Vertex) => Promise<boolean>;
  onDownloadButtonClick: (assetId: string) => void;
}

const GraphMap: FC<GraphMapProps> = ({
  vertices,
  edgeReferences,
  autoArrange = true,
  hideToggleButtons = false,
  hideChildrenTooltip,
  showChildrenTooltip,
  hideParentsTooltip,
  showParentsTooltip,
  showChildrenButton,
  showParentsButton,
  showGrouping = false,
  legend,
  availableViewportHeight,
  customTools,
  showGroupsHeader = true,
  showNodesAsSingle = false,
  onOpenChildren,
  onCloseChildren,
  onOpenParents,
  onCloseParents,
  onDownloadButtonClick,
}) => {
  const dispatch = useDispatch();
  const { groupsFilters } = useSelector(
    (state: RootState) => state.app.graphMap
  );
  const viewportRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<Point>({
    x: WORKSPACE_WIDTH / 2,
    y: WORKSPACE_HEIGHT / 2,
  });
  const [locatedRootVertices, setLocatedRootVertices] = useState<Vertex[]>([]);
  const [verticesTree, setVerticesTree] = useState<Vertex[]>([]);
  const [modifiedVerticesGroups, setModifiedVerticesGroups] =
    useState<ModifiedVerticesGroups>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  // const [filteredVertices, setFilteredVertices] = useState<Vertex[]>([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  // const [availableGroupNames, setAvailableGroupNames] = useState<string[]>([]);
  const centerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setViewportWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(viewportRef.current);

      return () => {
        if (viewportRef.current) {
          resizeObserver.unobserve(viewportRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (centerButtonRef && centerButtonRef.current) {
      setTimeout(() => {
        centerButtonRef.current?.click();
      }, 100);
    }
  }, [centerButtonRef.current]);

  useEffect(() => {
    setViewportHeight(availableViewportHeight);
  }, [availableViewportHeight]);

  useEffect(() => {
    if (vertices.length > 0 && autoArrange) {
      setCenter({
        x: getInitialX(vertices, viewportWidth),
        y: getInitialY(vertices, viewportHeight),
      });

      setLocatedRootVertices(locateRootVertices(vertices));
    }
  }, [vertices, autoArrange]);

  useEffect(() => {
    if (locatedRootVertices.length > 0) {
      const verticesTreeGrouped = groupSubVertices(
        locatedRootVertices,
        modifiedVerticesGroups
      );
      const verticesTreeLocated = locateSubVertices(verticesTreeGrouped);
      setVerticesTree(verticesTreeLocated);
      // setVerticesGroups(locateGroups(locatedRootVertices[0].geometry, groups));
      // const unified = unifyGroupNames(groups);
      // setAvailableGroupNames(unifyGroupNames(groups));
    }
  }, [locatedRootVertices, showGrouping]);

  useEffect(() => {
    if (edgeReferences && verticesTree) {
      const additionalEdges: Edge[] = edgeReferences.reduce<Edge[]>(
        (acc, connectionLine) => {
          const origin = searchVertexInGroups(
            verticesTree,
            connectionLine.fromId
          );
          const target = searchVertexInGroups(
            verticesTree,
            connectionLine.toId
          );

          if (origin && target) {
            return [
              ...acc,
              {
                id: getEdgeId(origin, target),
                origin: origin.geometry,
                target: target.geometry,
              },
            ];
          }
          return [];
        },
        []
      );
      setEdges(additionalEdges);
    }
  }, [verticesTree, edgeReferences]);

  const handleSelectedGroupNamesChange = (
    event: SelectChangeEvent<typeof groupsFilters>
  ) => {
    const {
      target: { value },
    } = event;

    dispatch(
      updateGraphMapGroupsFilter(
        typeof value === 'string' ? value.split(',') : value
      )
    );
  };

  const handleSelectAllGroups = (): void => {
    dispatch(updateGraphMapGroupsFilter([]));
  };

  const handleDeselectAllGroups = (): void => {
    // dispatch(updateGraphMapGroupsFilter(availableGroupNames));
  };

  const handleOpenChildren = async (vertex: Vertex): Promise<boolean> => {
    if (onOpenChildren) {
      await onOpenChildren(vertex);
      const siblings = getSiblingsInGroup(verticesTree, vertex.id);
      console.log('Closing siblings', siblings);
      return true;
    } else {
      return true;
    }
  };

  const handleCloseChildren = async (vertex: Vertex): Promise<boolean> => {
    if (onCloseChildren) {
      setVerticesTree(
        verticesTree.map(v =>
          v.id === vertex.id
            ? {
                ...v,
                childrenGroups: [],
                childrenEdges: [],
              }
            : { ...v }
        )
      );
      return onCloseChildren(vertex);
    } else {
      return true;
    }
  };

  const handleOpenParents = async (vertex: Vertex): Promise<boolean> => {
    if (onOpenParents) {
      await onOpenParents(vertex);
      const siblings = getSiblingsInGroup(verticesTree, vertex.id);
      console.log('Closing siblings', siblings);
      return true;
    } else {
      return true;
    }
  };

  const handleCloseParents = async (vertex: Vertex): Promise<boolean> => {
    if (onCloseParents) {
      setVerticesTree(
        verticesTree.map(v =>
          v.id === vertex.id
            ? {
                ...v,
                parentsGroups: [],
                parentsEdges: [],
              }
            : { ...v }
        )
      );
      return onCloseParents(vertex);
    } else {
      return true;
    }
  };

  const handleViewMoreVertices = (verticesGroup: VerticesGroup): void => {
    let visibleVertices =
      verticesGroup.visibleVertices + GROUP_EXTRA_VERTICES_ON_VIEW_MORE;
    if (modifiedVerticesGroups[verticesGroup.id]) {
      visibleVertices =
        modifiedVerticesGroups[verticesGroup.id].visibleVertices +
        GROUP_EXTRA_VERTICES_ON_VIEW_MORE;
    }
    setModifiedVerticesGroups({
      ...modifiedVerticesGroups,
      [verticesGroup.id]: {
        ...verticesGroup,
        visibleVertices,
      },
    });

    setVerticesTree(
      locateSubVertices(
        updateVerticesGroup(verticesTree, {
          ...verticesGroup,
          visibleVertices,
        })
      )
    );
  };

  const handleViewAllVertices = (verticesGroup: VerticesGroup): void => {
    let visibleVertices = verticesGroup.vertices.length;
    setModifiedVerticesGroups({
      ...modifiedVerticesGroups,
      [verticesGroup.id]: {
        ...verticesGroup,
        visibleVertices,
      },
    });

    setVerticesTree(
      locateSubVertices(
        updateVerticesGroup(verticesTree, {
          ...verticesGroup,
          visibleVertices,
        })
      )
    );
  };

  const handleTogglePinGroup = (verticesGroup: VerticesGroup): void => {
    setModifiedVerticesGroups({
      ...modifiedVerticesGroups,
      [verticesGroup.id]: {
        ...verticesGroup,
        isPinned: !verticesGroup.isPinned,
      },
    });

    setVerticesTree(
      updateVerticesGroup(verticesTree, {
        ...verticesGroup,
        isPinned: !verticesGroup.isPinned,
      })
    );
  };

  const handleHighLightThree = (
    verticesGroup: VerticesGroup,
    isHighlighted: boolean
  ): void => {
    dispatch(updateHighlighted(isHighlighted));
    verticesTree[0].childrenGroups?.forEach(childrenGroup => {
      if (childrenGroup.id === verticesGroup.id) {
        higlightVertice(childrenGroup, isHighlighted);
      }
    });

    verticesTree[0].parentsGroups?.forEach(parentGroup => {
      if (parentGroup.id === verticesGroup.id) {
        higlightVertice(parentGroup, isHighlighted);
      }
    });
  };

  const higlightVertice = (
    verticesGroup: VerticesGroup,
    isHighlighted: boolean
  ) => {
    setVerticesTree(
      updateVerticesGroup(verticesTree, {
        ...verticesGroup,
        isHighlighted,
      })
    );
  };

  /* const getVerticeType = (verticeId: string) => {
    let result = '';
    vertices.forEach(vertice => {
      let verticeFound = vertice.children?.find(
        verticeChildren => verticeChildren.groupId === verticeId
      )?.type;
      if (!verticeFound) {
        verticeFound = vertice.parents?.find(
          verticeParent => verticeParent.groupId === verticeId
        )?.type;
      }
      if (verticeFound) {
        result = verticeFound;
      }
    });
    return result;
  }; */

  return (
    <div className={styles.graphMap}>
      <div
        className={styles.viewport}
        ref={viewportRef}
        style={{ height: viewportHeight }}
      >
        {viewportWidth && viewportHeight && (
          <TransformWrapper
            initialScale={INITIAL_SCALE}
            limitToBounds={false}
            minScale={MIN_SCALE}
            maxScale={MAX_SCALE}
            wheel={{ step: WHEEL_STEP }}
            initialPositionX={getInitialX(vertices, viewportWidth)}
            initialPositionY={getInitialY(vertices, viewportHeight)}
            panning={{ velocityDisabled: true }}
          >
            {({ setTransform }) => (
              <>
                <GraphMapTools
                  // availableGroupNames={availableGroupNames}
                  availableGroupNames={[]}
                  filteredGroupNames={groupsFilters}
                  showGrouping={showGrouping}
                  centerButtonRef={centerButtonRef}
                  customTools={customTools}
                  onFilteredGroupsChange={handleSelectedGroupNamesChange}
                  onSelectAllGroups={handleSelectAllGroups}
                  onDeselectAllGroups={handleDeselectAllGroups}
                  onCenter={() =>
                    setTransform(center.x, center.y, INITIAL_SCALE)
                  }
                />
                <GraphMapLegend>{legend}</GraphMapLegend>
                <TransformComponent
                  wrapperStyle={{
                    width: WORKSPACE_WIDTH,
                    height: WORKSPACE_HEIGHT,
                  }}
                  contentStyle={{ width: '100%', height: '100%' }}
                >
                  <svg
                    className={styles.workspace}
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="geometricPrecision"
                  >
                    <EdgeLineArrow />
                    {verticesTree.map(vertex => {
                      return (
                        <Fragment key={vertex.id}>
                          {vertex.childrenGroups &&
                            vertex.childrenGroups.map((vg, index) => (
                              <VertexNodeGroup
                                key={vg.id + index}
                                verticesGroup={vg}
                                isVisible={!groupsFilters.includes(vg.label)}
                                onOpenChildren={handleOpenChildren}
                                onCloseChildren={handleCloseChildren}
                                onOpenParents={handleOpenParents}
                                onCloseParents={handleCloseParents}
                                onDownloadButtonClick={onDownloadButtonClick}
                                onViewMoreVertices={handleViewMoreVertices}
                                onViewAllVertices={handleViewAllVertices}
                                onTogglePinGroup={handleTogglePinGroup}
                                hideChildrenTooltip={hideChildrenTooltip}
                                showChildrenTooltip={showChildrenTooltip}
                                hideParentsTooltip={hideParentsTooltip}
                                showParentsTooltip={showParentsTooltip}
                                showHeader={showGroupsHeader}
                                showNodesAsSingle={showNodesAsSingle}
                                showChildrenButton
                                onHighlightThree={handleHighLightThree}
                              />
                            ))}
                          {vertex.parentsGroups &&
                            vertex.parentsGroups.map((vg, index) => (
                              <VertexNodeGroup
                                key={vg.id + index}
                                verticesGroup={vg}
                                isVisible={!groupsFilters.includes(vg.label)}
                                onOpenChildren={handleOpenChildren}
                                onCloseChildren={handleCloseChildren}
                                onOpenParents={handleOpenParents}
                                onCloseParents={handleCloseParents}
                                onDownloadButtonClick={onDownloadButtonClick}
                                onViewMoreVertices={handleViewMoreVertices}
                                onViewAllVertices={handleViewAllVertices}
                                onTogglePinGroup={handleTogglePinGroup}
                                hideChildrenTooltip={hideChildrenTooltip}
                                showChildrenTooltip={showChildrenTooltip}
                                hideParentsTooltip={hideParentsTooltip}
                                showParentsTooltip={showParentsTooltip}
                                showHeader={showGroupsHeader}
                                showNodesAsSingle={showNodesAsSingle}
                                showParentsButton
                                onHighlightThree={handleHighLightThree}
                              />
                            ))}
                          {vertex.childrenEdges?.map(edge => (
                            <EdgeLine key={edge.id} edge={edge} />
                          ))}
                          {vertex.parentsEdges?.map(edge => (
                            <EdgeLine key={edge.id} edge={edge} />
                          ))}
                        </Fragment>
                      );
                    })}
                    {locatedRootVertices.map(v => (
                      <VertexNode
                        key={v.id}
                        vertex={{
                          ...v,
                          isRoot: true,
                          hideToggleButton:
                            hideToggleButtons === true ||
                            v.hideToggleButton === true
                              ? true
                              : v.hideToggleButton,
                        }}
                        onOpenChildren={handleOpenChildren}
                        onCloseChildren={handleCloseChildren}
                        onOpenParents={handleOpenParents}
                        onCloseParents={handleCloseParents}
                        onDownloadButtonClick={onDownloadButtonClick}
                        hideChildrenTooltip={hideChildrenTooltip}
                        showChildrenTooltip={showChildrenTooltip}
                        hideParentsTooltip={hideParentsTooltip}
                        showParentsTooltip={showParentsTooltip}
                        showParentsButton={showParentsButton}
                        showChildrenButton={showChildrenButton}
                      />
                    ))}
                    {edges.map(edge => (
                      <EdgeLine key={edge.id} edge={edge} />
                    ))}
                  </svg>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        )}
      </div>
    </div>
  );
};

export default GraphMap;
