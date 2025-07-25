import React, {
  ReactElement,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Background,
  ReactFlow,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  NodeChange,
  EdgeChange,
  useEdgesState,
  Edge,
  useNodesState,
  MarkerType,
} from '@xyflow/react';
import LineageFlowCustomEdge from './LineageFlowCustomEdge';
import LineageFlowNode from './LineageFlowNode';
import { EdgeFlowDataElement } from 'types/flow.types';
import '@xyflow/react/dist/style.css';
import styles from './LineageFlow.module.scss';
import { AnimatedSVGEdge } from './LineageFlowAnimatedEdge';
import { useApolloErrorHandler } from '../../../sideEffects/api/useApolloErrorHandler';
import { LineageFlowDownloadButton } from './LineageFlowDownload';
import FileCopyIcon from '@mui/icons-material/ContentCopy';
import DisabledVisibleIcon from '@mui/icons-material/VisibilityOff';
import VisibleIcon from '@mui/icons-material/Visibility';
import StorageIcon from '@mui/icons-material/Storage';
import CompressIcon from '@mui/icons-material/Compress';
import DevicesIcon from '@mui/icons-material/Devices';
import HubIcon from '@mui/icons-material/Hub';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

import {
  getNodeColor,
  getRootType,
  getStartTypeByQueryType,
  getTypesByQueryType,
  getUrlFromNodeId,
  queryTypesSearchNodes,
} from './LineageFlowHelpers';
import { getPlatformIcon } from 'utils/datasources.utils';

import { NodeTypeEnum, QueryTypeEnum } from 'utils/lineage.utils';
import {
  REQUEST_LINEAGE_REPORT,
  SEARCH_NODES,
} from 'containers/TableDetails/controllers/query';
import { FetchResult, useLazyQuery, useMutation } from '@apollo/client';
import { QueryNodesResponse } from 'types/api.types';
import {
  getAvailablePlatformsToUrl,
  getPlatformById,
  getUrn,
} from 'utils/urls.utils';
import { NodeFlowCustomData, NodeFlowDataNode } from 'types/flow.types';
import { VertexRelationship } from 'components/GraphMap/GraphMap.types';
import { LineageDownloadDirection } from 'containers/Downloads/download.utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'sideEffects/reducers';
import DownloadDialog from '../LineageViewer/DownloadDialog/DownloadDialog';
import { toastMessage } from '../../../utils';
import {
  LineageFlowCustomAccordion,
  LineageFlowCustomAccordionDetails,
  LineageFlowCustomAccordionSummary,
} from './LineageFlowAccordion';
import {
  NodeFlowFunctions,
  ROOT_NODE_POSITION,
  ROOT_NODE_SIZE,
  findAncestors,
  getRawId,
  makeNodes,
} from './LineageFlow.functions';
import { EdgeBase } from '@xyflow/system';
import LineageFlowMainNode from './LineageFlowMainNode';
import { NodeFlowFullPosition } from 'types/flow.types';
import { NodeType } from 'types/entities.types';
import { Search } from 'lucide-react';
import { DatasourcesEnum } from 'utils/datasources.utils';

interface Props {
  assetId: string;
  assetName: string;
  queryType: QueryTypeEnum;
  title?: string;
  dataSource: string;
  legend?: ReactElement;
  showVertexDetails?: boolean;
  userEmail?: string;
  useNewDesign: boolean;
  showGroupsHeader?: boolean;
  showNodesAsSingle?: boolean;
  onVertexClick?: (
    vertexAssetId: string,
    vertexAssetName: string,
    vertexDataSourceName: string
  ) => void;
  onLoadedJobs?: (
    vertexAssetId: string,
    vertexAssetName: string,
    vertexDataSourceName: string
  ) => void;
}

const nodeTypes = {
  customNode: LineageFlowNode,
  rootNode: LineageFlowMainNode,
} as const;

const edgeTypes = {
  animatedEdge: AnimatedSVGEdge,
  customEdge: LineageFlowCustomEdge,
};

const initialEdges: EdgeFlowDataElement[] = [];

const LineageFlow: React.FC<Props> = ({
  assetId,
  assetName,
  queryType,
  dataSource,
}) => {
  const defaultViewport = { x: 0, y: 0, zoom: 1 };
  const user = useSelector((state: RootState) => state.user);
  const [, setSearchQuery] = useState('');
  const { apolloErrorHandler } = useApolloErrorHandler();
  const [selectedAssetToDownload, setSelectedAssetToDownload] =
    useState<string>();
  const [selectedNode, setSelectedNode] = useState<NodeFlowCustomData>();
  const [openCopyToClipboard, setOpenCopyToClipboard] = useState(false);
  const dispatch = useDispatch();
  const [nodes, setNodes] = useNodesState<NodeFlowCustomData>([]);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef<Edge[]>([]);
  const rootType = getRootType(dataSource, queryType) as QueryTypeEnum;
  const [hiddenNodes, setHiddenNodes] = useState(0);
  const externalUrl = useSelector(
    (state: RootState) => state.app.selectedAsset.externalUrl
  );

  const [queryNodes, { loading, error }] = useLazyQuery(SEARCH_NODES(), {
    fetchPolicy: 'cache-and-network',
  });

  const [requestLineageReport] = useMutation(REQUEST_LINEAGE_REPORT);

  useEffect(() => {
    if (error) {
      apolloErrorHandler(error);
    }
  }, [error]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  function getNodesPositions(nodes: NodeFlowCustomData[]) {
    const nodesPositions: NodeFlowFullPosition[] = [];

    nodes.forEach(node => {
      nodesPositions.push({
        x: node.position.x,
        y: node.position.y,
        width: node.width ?? 0,
        height: node.height ?? 0,
      });
    });
    return nodesPositions;
  }

  const generateEdgesFromNodes = useCallback(
    (currentNodes: NodeFlowCustomData[]): EdgeFlowDataElement[] => {
      const newEdges: EdgeFlowDataElement[] = [];
      const existingEdgeIds = new Set(edges.map(edge => edge.id));
      const randomNumber = Math.floor(Math.random() * 1000);

      currentNodes.forEach(node => {
        if (node.data.parentId) {
          const edgeColor =
            node.data.nodeSide === 'childOf'
              ? 'rgb(182, 112, 66,1)'
              : 'rgb(113, 175, 192,1)';

          const edgeId = `edge-${node.data.parentId}-${node.id}-${randomNumber}`;

          if (!existingEdgeIds.has(edgeId)) {
            const newEdge: EdgeFlowDataElement = {
              id: edgeId,
              source: node.data.parentId,
              target: node.id,
              sourceHandle:
                node.data.nodeSide === 'childOf'
                  ? 'source-right'
                  : 'source-left',
              targetHandle:
                node.data.nodeSide === 'childOf'
                  ? 'target-left'
                  : 'target-right',
              type: 'customEdge',
              data: {
                label: node?.data.edgeLabel as string,
              },
              markerStart:
                node.data.nodeSide === 'parentOf'
                  ? {
                      type: MarkerType.ArrowClosed,
                      width: 20,
                      height: 20,
                      color: edgeColor,
                    }
                  : '',
              markerEnd:
                node.data.nodeSide === 'childOf'
                  ? {
                      type: MarkerType.ArrowClosed,
                      width: 20,
                      height: 20,
                      color: edgeColor,
                    }
                  : '',
              style: { stroke: edgeColor, strokeWidth: 1 },
            };
            newEdges.push(newEdge);
          }
        }
      });

      return newEdges;
    },
    [edges]
  );

  function updateEdges(nodes: NodeFlowCustomData[]) {
    const newEdges = generateEdgesFromNodes(nodes);
    setEdges(eds => [...eds, ...newEdges]);
  }

  const loadNodes = useCallback(
    async (
      originVertex: NodeFlowCustomData,
      nodeSide: VertexRelationship
    ): Promise<any> => {
      try {
        if (
          originVertex?.data?.id !== undefined &&
          originVertex?.data?.label !== undefined &&
          originVertex?.data?.queryType !== undefined
        ) {
          const response: QueryNodesResponse = await queryNodes({
            variables: {
              id: getRawId(originVertex?.data?.id),
              startType: getStartTypeByQueryType(
                queryType,
                originVertex?.data?.queryType.toUpperCase()
              ),
              includeTypes: getTypesByQueryType(queryType, dataSource),
              page: 0,
            },
          });

          const nodesData = response.data.searchNodes;
          const nodeFunctions: NodeFlowFunctions = {
            onExpandLeft: handleAddParent,
            onExpandRight: handleAddChildren,
            onContractLeft: handleRemoveParent,
            onContractRight: handleRemoveChildren,
            onDownloadNode: handleDownloadButtonClick,
            onHighlight: handleHighlight,
          };

          const nodesPositions = getNodesPositions(nodesRef.current);

          if (nodesData.length > 0) {
            const nodesProcess = makeNodes(
              nodesData,
              nodeSide,
              originVertex,
              nodeFunctions,
              nodesPositions,
              dataSource as DatasourcesEnum
            );

            const newNodes = nodesProcess.nodes;

            setNodes(currentNodes => {
              const existingNodeIds = new Set(
                currentNodes.map(node => node.id)
              );
              const newNodesFiltered = newNodes.filter(
                node => !existingNodeIds.has(node.id)
              );
              return [...currentNodes, ...newNodesFiltered];
            });
            if (nodesRef.current.length === 1) {
              newNodes.unshift(nodesRef.current[0]);
            }
            updateEdges(newNodes);
            const newEdges = generateEdgesFromNodes(newNodes);
            setEdges(currentEdges => {
              const uniqueEdges = [...currentEdges];
              newEdges.forEach(newEdge => {
                if (!uniqueEdges.some(edge => edge.id === newEdge.id)) {
                  uniqueEdges.push(newEdge);
                }
              });
              return uniqueEdges;
            });
            return newNodes;
          }
        }
        return [];
      } catch (error) {
        console.error('Error loading nodes:', error);
        return [];
      }
    },
    [queryNodes, queryType, dataSource, generateEdgesFromNodes]
  );

  const handleDownloadButtonClick = (assetId: string): void => {
    setSelectedAssetToDownload(getRawId(assetId));
  };

  const handleDownloadDialogClose = (): void => {
    setSelectedAssetToDownload(undefined);
  };

  const handleDownloadDialogSubmit = (
    selectedAssetId: string,
    depth: number,
    direction: LineageDownloadDirection,
    requestName?: String
  ): void => {
    const userSub = user.personalInfo?.sub || null;
    const userEmail = user.personalInfo?.email || null;
    requestLineageReport({
      variables: {
        asset_ids: [selectedAssetId],
        request_name: requestName,
        user_id: userSub,
        email: userEmail,
        direction: direction,
        depth: depth,
      },
    })
      .then((response: FetchResult<{ requestLineageProcessing: string }>) => {
        toastMessage(dispatch, response.data?.requestLineageProcessing || '');
      })
      .catch(error =>
        toastMessage(
          dispatch,
          `Lineage download request failed: ${error.message}`,
          'error'
        )
      );
    setSelectedAssetToDownload(undefined);
  };

  const loadChildren = useCallback(
    async (id: string, direction: VertexRelationship): Promise<boolean> => {
      const foundNode = nodesRef.current.find(
        node => node.id === id || node.data.id === id
      );

      if (foundNode && queryTypesSearchNodes.includes(queryType)) {
        try {
          const newNodes = await loadNodes(foundNode, direction);
          if (newNodes && newNodes.length > 0) {
            setNodes(currentNodes => {
              const existingNodeIds = new Set(
                currentNodes.map(node => node.id)
              );
              const filteredNewNodes = newNodes.filter(
                (node: { id: string }) => !existingNodeIds.has(node.id)
              );
              const updatedNodes = [...currentNodes, ...filteredNewNodes];
              nodesRef.current = updatedNodes;
              return updatedNodes;
            });
            return true;
          }
        } catch (error) {
          console.error('Error loading children:', error);
        }
      }
      return false;
    },
    [loadNodes]
  );

  const handleAddChildren = useCallback(
    (id: string) => {
      const foundNode = nodesRef.current.find(
        node => node.id === id || node.data.id === id
      );

      if (foundNode) {
        foundNode.data.isExpandedRight = true;
        loadChildren(id, 'childOf');
        if (foundNode.type === 'rootNode') {
          setHiddenNodes(0);
        }
      }
    },
    [loadChildren]
  );

  const handleAddParent = useCallback(
    (id: string) => {
      const foundNode = nodesRef.current.find(
        node => node.id === id || node.data.id === id
      );

      if (foundNode) {
        loadChildren(id, 'parentOf');
      }
    },
    [loadChildren]
  );

  const handleRemoveChildren = (id: string) => {
    handleRemoveNode(id, 'childOf');
  };

  const handleRemoveParent = (id: string) => {
    handleRemoveNode(id, 'parentOf');
  };

  const handleRemoveNode: (id: string, nodeSide: VertexRelationship) => void =
    useCallback((id: string, nodeSide: VertexRelationship) => {
      const nodesToDelete: Node[] = [];
      const foundNode = nodesRef.current.find(
        node => node?.id === id || node?.data.id === id
      );
      if (foundNode) {
        const findChildren = (foundNode: Node) => {
          const children = nodesRef.current.filter(
            node =>
              node.data.parentId === foundNode.id &&
              node.data.nodeSide === nodeSide
          );
          children.forEach(child => {
            nodesToDelete.push(child);
            findChildren(child);
          });
        };

        findChildren(foundNode);
        nodesToDelete.forEach(childrenNode => {
          setNodes((currentNodes: NodeFlowCustomData[]) => {
            const newNodes = currentNodes.filter(
              node => node.id !== childrenNode.id
            );
            return newNodes;
          });
        });
      }
    }, []);

  const resetHighlight = () => {
    setNodes((prevNodes: NodeFlowCustomData[]) => {
      return prevNodes.map(internalNode => {
        return {
          ...internalNode,
          data: {
            ...internalNode.data,
            isHighlighted: false,
          },
        };
      });
    });
  };
  const handleHighlight = (node: NodeFlowDataNode) => {
    resetHighlight();
    setNodes((prevNodes: NodeFlowCustomData[]) => {
      const newHighlightState = !node.isHighlighted;
      const ancestorIds = findAncestors(
        prevNodes.map(node => node as NodeFlowCustomData),
        node?.id || ''
      );

      const updatedNodes = prevNodes.map(internalNode => {
        // Update current node
        if (internalNode.id === node.id) {
          return {
            ...internalNode,
            data: {
              ...internalNode.data,
              isHighlighted: newHighlightState,
            },
          };
        }

        // Update ancestors
        if (ancestorIds.has(internalNode.id)) {
          return {
            ...internalNode,
            data: {
              ...internalNode.data,
              isHighlighted: newHighlightState,
            },
          };
        }

        return internalNode;
      });

      return updatedNodes;
    });
  };

  const loadRootNode = useCallback(() => {
    let label = assetName;
    try {
      label =
        decodeURI(
          dataSource === DatasourcesEnum.DeltaLake ? assetId : assetName
        ) || decodeURI(assetId);
    } catch (error) {
      console.warn(error);
    }
    const rootNodeData: NodeFlowDataNode = {
      id: getUrn(
        rootType as unknown as NodeType,
        dataSource,
        assetId,
        externalUrl
      ),
      label: label,
      dataSource,
      parentId: '',
      nodeSide: 'childOf',
      depth: 0,
      queryType: getRootType(dataSource, queryType) as QueryTypeEnum,
      nodeType: rootType as unknown as NodeTypeEnum,
      isSelected: false,
      isDownloadActive: dataSource === DatasourcesEnum.Airflow ? false : true,
      edgeLabel: '',
      onExpandLeft: handleAddParent,
      onExpandRight: handleAddChildren,
      onContractLeft: handleRemoveParent,
      onContractRight: handleRemoveChildren,
      onDownloadNode: handleDownloadButtonClick,
      onHighlight: handleHighlight,
    };

    const rootNode: NodeFlowCustomData = {
      id: decodeURI(assetId),
      type: 'rootNode',
      position: ROOT_NODE_POSITION,
      data: rootNodeData,
      width: ROOT_NODE_SIZE.width,
      height: ROOT_NODE_SIZE.height,
    };

    setNodes([]);
    setEdges([]);
    setNodes([rootNode]);
    nodesRef.current = [rootNode];
  }, [
    assetId,
    assetName,
    dataSource,
    queryType,
    handleAddParent,
    handleAddChildren,
    handleRemoveParent,
    handleRemoveChildren,
    handleDownloadButtonClick,
    handleHighlight,
  ]);

  const highlightSearchedNode = useCallback(
    (nodeId: string) => {
      setNodes((prevNodes: NodeFlowCustomData[]) => {
        return prevNodes.map((node: NodeFlowCustomData) => {
          // Search in node group
          let hasMatchingChild = false;
          const nodeIdTrimmed = getRawId(nodeId).toLowerCase();
          const internalNodeIdTrimmed = getRawId(
            node?.data?.label ? node?.data?.label : node.id
          ).toLowerCase();
          if (internalNodeIdTrimmed.includes(nodeIdTrimmed)) {
            hasMatchingChild = true;
          }

          return {
            ...node,
            data: {
              ...node.data,
              isHighlighted: hasMatchingChild,
            },
          };
        });
      });
    },
    [setNodes]
  );

  useEffect(() => {
    loadRootNode();
  }, [assetId]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);

      if (query.trim()) {
        highlightSearchedNode(query);
      } else {
        // Clear Highlighted
        setNodes((nodes: NodeFlowCustomData[]) =>
          nodes.map((node: NodeFlowCustomData) => ({
            ...node,
            data: {
              ...node.data,
              isHighlighted: false,
            },
          }))
        );
      }
    },
    [highlightSearchedNode]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(nds => {
        return applyNodeChanges(changes, nds) as NodeFlowCustomData[];
      }),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: EdgeBase[]) => {
        return applyEdgeChanges(changes, eds) as EdgeFlowDataElement[];
      }),
    []
  );

  const onNodeClick = (event: React.MouseEvent, node: NodeFlowCustomData) => {
    event.preventDefault();
    setSelectedNode(node);
    setNodes((prevNodes: NodeFlowCustomData[]) =>
      prevNodes.map((internalNode: NodeFlowCustomData) => ({
        ...internalNode,
        data: {
          ...internalNode.data,
          isSelected: node.id === internalNode.id,
        },
      }))
    );
    handleHighlight(node.data);
  };

  const handleCopyToClipboard = (message: string) => {
    navigator.clipboard.writeText(message).then(
      () => {
        setOpenCopyToClipboard(true);
      },
      () => {
        console.error('Failed to copy to clipboard');
      }
    );
  };

  const handleHideOthers = () => {
    setNodes((prevNodes: NodeFlowCustomData[]) =>
      prevNodes.map((internalNode: NodeFlowCustomData) => ({
        ...internalNode,
        hidden:
          !internalNode.data.isHighlighted && internalNode.type !== 'rootNode'
            ? true
            : false,
      }))
    );
    setHiddenNodes(() => hiddenNodes + 1);
  };

  const handleHideNode = () => {
    setNodes((prevNodes: NodeFlowCustomData[]) =>
      prevNodes.map((internalNode: NodeFlowCustomData) => ({
        ...internalNode,
        hidden:
          selectedNode?.id === internalNode.id ? true : internalNode.hidden,
      }))
    );
    setHiddenNodes(() => hiddenNodes + 1);

    // Hide children nodes
    handleHideNodes(selectedNode?.id ?? '');
  };

  const handleHideNodes = (parentId: string) => {
    setNodes((prevNodes: NodeFlowCustomData[]) => {
      // Create a copy to be modified
      const updatedNodes = [...prevNodes];

      // Recursive function to hide children
      const hideChildren = (currentParentId: string) => {
        // Find children
        const children = updatedNodes.filter(
          node => node.data.parentId === currentParentId
        );

        // Hide children
        children.forEach(child => {
          const index = updatedNodes.findIndex(n => n.id === child.id);
          if (index !== -1) {
            updatedNodes[index] = {
              ...updatedNodes[index],
              hidden: true,
            };
          }

          // Recursive call
          hideChildren(child.id);
        });
      };

      hideChildren(parentId);

      return updatedNodes;
    });
  };

  const handleShowAllNodes = () => {
    setNodes((prevNodes: NodeFlowCustomData[]) =>
      prevNodes.map((internalNode: NodeFlowCustomData) => ({
        ...internalNode,
        hidden: false,
      }))
    );
    setHiddenNodes(0);
  };

  const openExternalNode = (pageType: string) => {
    if (selectedNode) {
      let urlToOpen = getUrlFromNodeId(selectedNode);
      if (pageType === 'metadata') {
        urlToOpen = urlToOpen.replace('/lineage', '');
      }
      window.open(urlToOpen, '_blank', 'noreferrer');
    }
  };

  return (
    <>
      <div
        className="lineage-flow"
        style={{ minWidth: '100%', width: 'fit-content', height: '85vh' }}
      >
        {loading && (
          <div className={styles.overlayContainer}>
            <div className={styles.overlayBg}></div>
            <div className={styles.overlay}>
              {' '}
              <CircularProgress size={50} color="inherit" />
              Loading nodes...
            </div>
          </div>
        )}
        {selectedAssetToDownload && (
          <DownloadDialog
            isOpen={selectedAssetToDownload !== undefined}
            assetId={selectedAssetToDownload}
            assetType={queryType}
            onClose={handleDownloadDialogClose}
            onSubmit={handleDownloadDialogSubmit}
          />
        )}
        {hiddenNodes > 0 && (
          <div className={styles.hiddenNodesButton}>
            <Button
              onClick={handleShowAllNodes}
              variant="outlined"
              className={styles.actionButton}
            >
              <span>Show All Nodes</span>
              <VisibleIcon color="primary" fontSize="small" />
            </Button>
          </div>
        )}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-search">Search Node</InputLabel>
              <OutlinedInput
                id="outlined-search"
                type="text"
                onChange={handleSearch}
                className={styles.searchInput}
                endAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                label="Search Node"
              />
            </FormControl>
          </div>
          {selectedNode && (
            <div className={styles.selectedNode}>
              <LineageFlowCustomAccordion>
                <LineageFlowCustomAccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                >
                  <span>Node Details</span>
                </LineageFlowCustomAccordionSummary>
                <LineageFlowCustomAccordionDetails>
                  <Divider className={styles.selectedNodeToolbarDivider}>
                    <Chip label="Actions" size="small" />
                  </Divider>
                  <div className={styles.selectedNodeToolbar}>
                    <>
                      <div className={styles.actionButtonsContainer}>
                        <Button
                          onClick={handleHideNode}
                          color="info"
                          variant="outlined"
                          className={styles.actionButton}
                          disabled={selectedNode?.type === 'rootNode'}
                        >
                          <span>Hide node</span>
                          <DisabledVisibleIcon
                            color="primary"
                            fontSize="small"
                          />
                        </Button>
                        <Button
                          onClick={handleHideOthers}
                          color="info"
                          variant="outlined"
                          className={styles.actionButton}
                          disabled={
                            selectedNode?.type === 'rootNode' ||
                            (!selectedNode.data.isHighlighted &&
                              hiddenNodes > 0)
                          }
                        >
                          <span>Hide others</span>
                          <DisabledVisibleIcon
                            color="primary"
                            fontSize="small"
                          />
                        </Button>
                        <Button
                          onClick={() => openExternalNode('lineage')}
                          color="info"
                          variant="outlined"
                          disabled={
                            !getAvailablePlatformsToUrl(
                              getPlatformById(selectedNode?.id)
                            ) || selectedNode?.type === 'rootNode'
                          }
                          className={styles.actionButton}
                        >
                          <span>Lineage</span>
                          <OpenInBrowserIcon color="primary" fontSize="small" />
                        </Button>
                        <Button
                          onClick={() => openExternalNode('metadata')}
                          color="info"
                          variant="outlined"
                          disabled={
                            !getAvailablePlatformsToUrl(
                              getPlatformById(selectedNode?.id)
                            ) || selectedNode?.type === 'rootNode'
                          }
                          className={styles.actionButton}
                        >
                          <span>Metadata</span>
                          <OpenInBrowserIcon color="primary" fontSize="small" />
                        </Button>
                      </div>

                      <Snackbar
                        message="Node data copied to the clipboard!"
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        autoHideDuration={2000}
                        onClose={() => setOpenCopyToClipboard(false)}
                        open={openCopyToClipboard}
                      />
                    </>
                  </div>
                  <Divider>
                    <Chip label="Node Metadata" size="small" />
                  </Divider>
                  <div className={styles.selectedNodeToolbar}>
                    <div className={styles.selectedNodeToolbarBlock}>
                      <p className={styles.selectedNodeToolbarBlockTitle}>
                        <StorageIcon color="primary" fontSize="small" />
                        <span>Node Type</span>
                      </p>
                      <span>{selectedNode.data.nodeType || '-/-'}</span>
                    </div>
                    <div className={styles.selectedNodeToolbarBlock}>
                      <p className={styles.selectedNodeToolbarBlockTitle}>
                        <DevicesIcon color="primary" fontSize="small" />
                        <span>Platform</span>
                      </p>
                      {selectedNode?.type === 'rootNode' ? (
                        <div className={styles.selectedNodeToolbarItem}>
                          <img
                            className={styles.iconinfo}
                            src={getPlatformIcon(dataSource)}
                            alt="ds-icon"
                          />
                          <span>{dataSource}</span>
                        </div>
                      ) : (
                        <div className={styles.selectedNodeToolbarItem}>
                          <img
                            className={styles.iconinfo}
                            src={getPlatformIcon(
                              getPlatformById(selectedNode.id || '')
                            )}
                            alt="ds-icon"
                          />
                          <span>{getPlatformById(selectedNode.id || '')}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.selectedNodeToolbarBlock}>
                      <p className={styles.selectedNodeToolbarBlockTitle}>
                        <CompressIcon color="primary" fontSize="small" />
                        <span>Depth</span>
                      </p>
                      <div
                        className={`${styles.depthLevel} ${styles.depthLevelInfo}`}
                        style={{
                          backgroundColor: getNodeColor(
                            selectedNode.data.depth || 0
                          ),
                        }}
                      >
                        <p>{selectedNode.data.depth || '0'}</p>
                      </div>
                    </div>
                  </div>
                  <Divider>
                    <Chip label="Basic Details" size="small" />
                  </Divider>
                  <div className={styles.selectedNodeContent}>
                    <div className={styles.selectedNodeToolbarBlock}>
                      <p className={styles.selectedNodeToolbarBlockTitle}>
                        <HubIcon color="primary" fontSize="small" />
                        <span>Node Id</span>
                        <Tooltip title="Copy Node Id">
                          <Button
                            onClick={() =>
                              handleCopyToClipboard(
                                getRawId(selectedNode?.id || '')
                              )
                            }
                          >
                            <FileCopyIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </p>
                      <p>{getRawId(selectedNode.id)}</p>
                    </div>
                    <div className={styles.selectedNodeToolbarBlock}>
                      <p className={styles.selectedNodeToolbarBlockTitle}>
                        <HubIcon color="primary" fontSize="small" />
                        <span>Node Name</span>
                        <Tooltip title="Copy Node Name">
                          <Button
                            onClick={() =>
                              handleCopyToClipboard(
                                selectedNode?.data.label || ''
                              )
                            }
                          >
                            <FileCopyIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </p>
                      <p>{selectedNode?.data?.label}</p>
                    </div>
                  </div>
                </LineageFlowCustomAccordionDetails>
              </LineageFlowCustomAccordion>
            </div>
          )}
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          defaultViewport={defaultViewport}
          fitView
          minZoom={0.2}
          snapToGrid
          snapGrid={[5, 5]}
        >
          <Controls />
          <Background />
          <LineageFlowDownloadButton />
        </ReactFlow>
      </div>
    </>
  );
};

export default LineageFlow;
