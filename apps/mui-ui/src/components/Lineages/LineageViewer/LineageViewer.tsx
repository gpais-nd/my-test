import { FC, ReactElement, useEffect, useState, createContext } from 'react';
import {
  REQUEST_LINEAGE_REPORT,
  SEARCH_NODES,
  // SEARCH_NODES_DELTA,
} from '../../../containers/TableDetails/controllers/query';
import { FetchResult, useLazyQuery, useMutation } from '@apollo/client';
import { Tooltip } from '@mui/material';
import { getCorrectedAssetId, toastMessage } from '../../../utils';
import { useResizeWindow } from '../../../hooks/useResizeWindow';
import { GET_PIPELINE_LINEAGE } from '../../../containers/Pipelines/controllers/query';
import DownloadDialog from './DownloadDialog/DownloadDialog';
import { useApolloErrorHandler } from '../../../sideEffects/api/useApolloErrorHandler';
import LineageVertexContent from './LineageVertexContent/LineageVertexContent';
import {
  Dimensions,
  Point,
  Vertex,
  VertexDetail,
  EdgeReference,
  VertexRelationship,
} from '../../GraphMap/GraphMap.types';
import { GraphMap } from '../../GraphMap';
import styles from './LineageViewer.module.scss';
import { QueryNodesResponse } from '../../../types/api.types';
import { NodeType } from '../../../types/entities.types';
import { datasourceIsDataflow, getUrn } from '../../../utils/urls.utils';
import logoDelta from 'assets/deltalake_red.png';
import logoSnow from 'assets/snowflake.png';
import logoAirflow from 'assets/airflow.png';
import logoDatabricks from 'assets/databricks.png';
import { getSubVertices } from './LineageViewer.functions';
import { DatasourcesEnum, isEnabledDatasource } from 'utils/datasources.utils';
import {
  NodeTypeEnum,
  QueryTypeEnum,
  RelationTypeEnum,
} from 'utils/lineage.utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'sideEffects/reducers';
import { ObjectsMap, useSVGTracker } from 'hooks/useSvgCounter';
import { LineageDownloadDirection } from 'containers/Downloads/download.utils';

const REM = 16;

const COLUMN_HEADER_HEIGHT = 19 * REM;
const TABS_HEADER_HEIGHT = 14 * REM;

const SCALE_NODES = 0.5;
const ROOT_NODE_HEIGHT = 4.25 * REM * SCALE_NODES;
const ROOT_NODE_HEIGHT_WITH_DETAILS = 5.875 * REM * SCALE_NODES;
const ROOT_NODE_WIDTH = 26.3125 * REM * SCALE_NODES;
export const NODE_HEIGHT = 4 * REM * SCALE_NODES;
export const NODE_WIDTH = 29.4375 * REM * SCALE_NODES;
export const NODE_HEIGHT_WITH_DETAILS = 5.875 * REM * SCALE_NODES;

const queryTypesSearchNodes = [
  QueryTypeEnum.TABLE,
  QueryTypeEnum.COLUMN,
  QueryTypeEnum.PIPELINE,
];
const dataTypesByTable = ['DATASET', 'DATAFLOW'];
const dataTypesByTableSnowflake = ['DATASET', 'DATAFLOW'];
const dataTypesByColumn = ['FIELD'];

const getTypesByQueryType = (queryType: QueryTypeEnum, datasource?: string) => {
  switch (queryType) {
    case QueryTypeEnum.TABLE:
      if (datasource === DatasourcesEnum.Snowflake) {
        return dataTypesByTableSnowflake;
      }
      return dataTypesByTable;
    case QueryTypeEnum.COLUMN:
      return dataTypesByColumn;
    default:
      return [];
  }
};

const getStartTypeByQueryType = (
  queryType: QueryTypeEnum,
  originVertexType: string
) => {
  switch (queryType) {
    case QueryTypeEnum.TABLE:
      return originVertexType;
    case QueryTypeEnum.COLUMN:
      return 'FIELD';
    default:
      return '';
  }
};

interface Props {
  assetId: string;
  assetName: string;
  queryType: QueryTypeEnum;
  title?: string;
  dataSource: string;
  legend?: ReactElement;
  showVertexDetails?: boolean;
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

const queryTypesMap = new Map();
queryTypesMap.set(QueryTypeEnum.TABLE, {
  assetType: QueryTypeEnum.TABLE,
  relationTypes: [
    RelationTypeEnum.DOWNSTREAM,
    RelationTypeEnum.AF_DOWNSTREAM,
    RelationTypeEnum.CREATES,
    RelationTypeEnum.TRIGGERS,
  ],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});
queryTypesMap.set(QueryTypeEnum.QUERY, {
  assetType: QueryTypeEnum.QUERY,
  relationTypes: [RelationTypeEnum.REFERS],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});
queryTypesMap.set(QueryTypeEnum.COLUMN, {
  assetType: QueryTypeEnum.COLUMN,
  relationTypes: [RelationTypeEnum.COLUMN],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});
queryTypesMap.set(QueryTypeEnum.CLONED, {
  assetType: QueryTypeEnum.TABLE,
  relationTypes: [RelationTypeEnum.CLONED],
  hideChildrenTooltip: 'Close tables',
  showChildrenTooltip: 'Show tables',
  hideParentsTooltip: '',
  showParentsTooltip: '',
});
queryTypesMap.set(QueryTypeEnum.USER, {
  assetType: QueryTypeEnum.USER,
  relationTypes: [RelationTypeEnum.ACCESSED],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});
queryTypesMap.set(QueryTypeEnum.CW, {
  assetType: QueryTypeEnum.TABLE,
  relationTypes: [RelationTypeEnum.CW, RelationTypeEnum.CW_VIRTUAL],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});
queryTypesMap.set(QueryTypeEnum.JOB, {
  assetType: QueryTypeEnum.JOB,
  relationTypes: [
    RelationTypeEnum.AF_DOWNSTREAM,
    RelationTypeEnum.CREATES,
    RelationTypeEnum.TRIGGERS,
  ],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});
queryTypesMap.set(QueryTypeEnum.PIPELINE, {
  relationTypes: [RelationTypeEnum.AF_DOWNSTREAM],
  hideChildrenTooltip: 'Close downstream',
  showChildrenTooltip: 'Show downstream',
  hideParentsTooltip: 'Close upstream',
  showParentsTooltip: 'Show upstream',
});

// TODO: FIX THIS ANY
const getLineageDetails = (
  lineage: any,
  origin: 'dest' | 'src' = 'dest'
): VertexDetail[] => {
  const owners = lineage[`${origin}_owners`];
  const sla = lineage[`${origin}_dag_sla`];
  const avgTime = lineage[`${origin}_dag_avg_execution_time`];
  const team = lineage[`${origin}_team`];
  const critical = lineage[`${origin}_critical`];

  return [
    {
      name: 'Owner',
      value: owners && owners !== 'null' ? owners : '',
    },
    {
      name: 'SLA',
      value: sla && sla !== 'null' ? sla : '',
    },
    {
      name: 'Average time',
      value: avgTime && avgTime !== 'null' ? avgTime : '',
    },
    {
      name: 'Team',
      value: team && team !== 'null' ? team : '',
    },
    {
      name: 'Critical',
      value: critical && critical !== 'null' ? critical : '',
    },
  ];
};

interface LineageContextInterface {
  useNewDesign: boolean;
}

const LineageContext = createContext<LineageContextInterface>({
  useNewDesign: false,
});

const initialPosition: Point = {
  x: 0,
  y: 0,
};
const initialDimensions: Dimensions = {
  height: ROOT_NODE_HEIGHT,
  width: ROOT_NODE_WIDTH,
};

const initialDimensionsWithDetails: Dimensions = {
  height: ROOT_NODE_HEIGHT_WITH_DETAILS,
  width: ROOT_NODE_WIDTH,
};

const LineageViewer: FC<Props> = ({
  assetId,
  assetName,
  queryType,
  title,
  dataSource,
  legend,
  showVertexDetails = false,
  useNewDesign = false,
  showGroupsHeader = true,
  showNodesAsSingle = false,
  onVertexClick,
  onLoadedJobs,
}) => {
  const { windowHeight } = useResizeWindow();
  const { apolloErrorHandler } = useApolloErrorHandler();
  const { objects } = useSVGTracker();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    saveNodesInLocalStorage(objects);
  }, [objects]);

  const getVertexClassName = (vertexType: string): string => {
    switch (vertexType) {
      case DatasourcesEnum.Airflow:
        return styles.airflow;
      case DatasourcesEnum.Databricks:
        return styles.databricks;
      case DatasourcesEnum.DeltaLake:
        return styles.deltalake;
      case DatasourcesEnum.Snowflake:
        return styles.snowflake;
      default:
        return styles.default;
    }
  };

  const getDatabaseName = (lineage: any, relationType: RelationTypeEnum) => {
    return relationType === RelationTypeEnum.DOWNSTREAM
      ? lineage.dest_database
      : lineage.src_database;
  };

  const getRootType = () => {
    switch (queryType) {
      case QueryTypeEnum.PIPELINE:
        return 'Pipeline';
      case QueryTypeEnum.JOB:
        return 'Datajob';
      case QueryTypeEnum.TABLE:
        if (datasourceIsDataflow(dataSource)) {
          return 'Dataflow';
        }
        return 'Dataset';
      default:
        return 'Dataset';
    }
  };

  const [root, setRoot] = useState<Vertex>({
    id: assetId,
    content: assetName,
    parents: [],
    children: [],
    level: 0,
    type: getRootType(),
    showDetails: showVertexDetails,
    details: showVertexDetails ? [] : undefined,
    geometry: {
      position: initialPosition,
      dimensions: showVertexDetails
        ? initialDimensionsWithDetails
        : initialDimensions,
    },
  });
  const [jobs, setJobs] = useState<Vertex[]>([]);
  const [edgeReferences, setEdgeReferences] = useState<EdgeReference[]>([]);
  const showGrouping = queryType === QueryTypeEnum.TABLE;
  const [viewportHeight, setViewportHeight] = useState(0);
  const [selectedAssetToDownload, setSelectedAssetToDownload] =
    useState<string>();

  /* const [queryAssetLineage, { loading, error }] = useLazyQuery(
    queryType === QueryTypeEnum.PIPELINE
      ? GET_PIPELINE_LINEAGE()
      : GET_ASSET_LINEAGE_INPUT(),
    {
      fetchPolicy: 'cache-and-network',
    }
  ); */

  const [queryAssetLineage, { loading, error }] = useLazyQuery(
    GET_PIPELINE_LINEAGE(),
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const [queryNodes] = useLazyQuery(SEARCH_NODES(), {
    fetchPolicy: 'cache-and-network',
  });

  const [requestLineageReport] = useMutation(REQUEST_LINEAGE_REPORT);

  useEffect(() => {
    if (error) {
      apolloErrorHandler(error);
    }
  }, [error]);

  useEffect(() => {
    if (
      assetId &&
      queryType === QueryTypeEnum.TABLE &&
      root.id &&
      isEnabledDatasource(dataSource)
    ) {
      // loadAssetJobs(assetId, root.level);
      // TODO: Review this line, is calling old method
    }
    if (assetId && queryType === QueryTypeEnum.PIPELINE && showVertexDetails) {
      preloadPipelineAssetDetails(assetId);
    }
  }, [assetId, root.id]);

  useEffect(() => {
    const availableHeight =
      windowHeight -
      (queryType === QueryTypeEnum.COLUMN
        ? COLUMN_HEADER_HEIGHT
        : TABS_HEADER_HEIGHT);
    setViewportHeight(availableHeight);
  }, [windowHeight]);

  /**
   * Recursively traverse the graph and update the children of the target vertex at the given level.
   * @param {Vertex} rootVertex The root vertex of the graph.
   * @param {string} targetVertexId The ID of the target vertex to update.
   * @param {number} targetVertexLevel The level of the target vertex to update.
   * @param {Vertex[]} children The new children of the target vertex.
   * @returns {Vertex} The updated root vertex.
   */
  const updateVertexChildren = (
    rootVertex: Vertex,
    targetVertexId: string,
    targetVertexLevel: number,
    children: Vertex[]
  ): Vertex => {
    if (
      rootVertex.id === targetVertexId &&
      rootVertex.level === targetVertexLevel
    ) {
      return {
        ...rootVertex,
        children: children,
      };
    } else {
      if (rootVertex.children) {
        return {
          ...rootVertex,
          children: rootVertex.children.map(child =>
            updateVertexChildren(
              child,
              targetVertexId,
              targetVertexLevel,
              children
            )
          ),
        };
      } else {
        return {
          ...rootVertex,
        };
      }
    }
  };

  /**
   * Recursively traverse the graph and update the parents of the target vertex at the given level.
   * @param {Vertex} rootVertex The root vertex of the graph.
   * @param {string} targetVertexId The ID of the target vertex to update.
   * @param {number} targetVertexLevel The level of the target vertex to update.
   * @param {Vertex[]} parents The new parents of the target vertex.
   * @returns {Vertex} The updated root vertex.
   */
  const updateVertexParents = (
    rootVertex: Vertex,
    targetVertexId: string,
    targetVertexLevel: number,
    parents: Vertex[]
  ): Vertex => {
    if (
      rootVertex.id === targetVertexId &&
      rootVertex.level === targetVertexLevel
    ) {
      return {
        ...rootVertex,
        parents: parents,
      };
    } else {
      if (rootVertex.parents) {
        return {
          ...rootVertex,
          parents: rootVertex.parents.map(parent =>
            updateVertexParents(
              parent,
              targetVertexId,
              targetVertexLevel,
              parents
            )
          ),
        };
      } else {
        return {
          ...rootVertex,
        };
      }
    }
  };

  /**
   * Preloads the details of the given vertex asset ID by querying the lineage
   * for the given asset ID and relation type. If the query is successful, it
   * updates the root vertex with the details of the first lineage.
   * @param {string} vertexAssetId The ID of the vertex asset to preload.
   * @returns {Promise<boolean>} A promise that resolves to true if the query is
   * successful, false otherwise.
   */
  const preloadPipelineAssetDetails = async (
    vertexAssetId: string
  ): Promise<boolean> => {
    const relationTypes = queryTypesMap.get(queryType).relationTypes;

    // @ts-ignore
    let lineageFilters = relationTypes.map(relationType => ({
      asset_id: getCorrectedAssetId(
        vertexAssetId,
        dataSource,
        queryType,
        relationType
      ),
      ...(queryType !== QueryTypeEnum.JOB && {
        asset_type: queryTypesMap.get(queryType).assetType,
      }),
      relation_type: relationType,
    }));

    return queryAssetLineage({
      variables: { lineageFilters: lineageFilters },
    })
      .then(response => {
        const responseLineages = response.data.getPipelineLineage.lineages;
        const lineages = responseLineages
          // @ts-ignore
          .filter((lineage: { dest_id: any; src_id: any }) => {
            const returnedAssetId = lineage.src_id;

            const correctedAssetId = getCorrectedAssetId(
              vertexAssetId,
              dataSource,
              queryType,
              RelationTypeEnum.DOWNSTREAM
            );

            return (
              returnedAssetId === vertexAssetId ||
              returnedAssetId === correctedAssetId
            );
          });

        if (lineages.length > 0) {
          const details = getLineageDetails(lineages[0], 'src');
          setRoot({ ...root, details });
        }
        return true;
      })
      .catch(() => false);
  };

  /**
   * Loads nodes related to the given origin vertex based on the specified relationship type.
   * It queries the nodes using the origin vertex's ID and relation details, then updates
   * the root vertex with the sub-vertices found.
   *
   * @param {Vertex} originVertex - The vertex from which to load related nodes.
   * @param {VertexRelationship} relationsToLoad - The type of relationship to load, either 'childOf' or 'parentOf'.
   * @returns {Promise<boolean>} A promise that resolves to true if the nodes are successfully loaded and processed, false otherwise.
   */
  const loadNodes = async (
    originVertex: Vertex,
    relationsToLoad: VertexRelationship
  ): Promise<boolean> => {
    return queryNodes({
      variables: {
        id: originVertex.id,
        startType: getStartTypeByQueryType(
          queryType,
          originVertex.type.toUpperCase()
        ),
        includeTypes: getTypesByQueryType(queryType, dataSource),
        page: 0,
      },
    })
      .then((response: QueryNodesResponse) => {
        const subVertices = getSubVertices(
          relationsToLoad,
          originVertex,
          response.data.searchNodes,
          showVertexDetails
        );
        if (relationsToLoad === 'childOf') {
          const updatedChildren = updateVertexChildren(
            root,
            originVertex.id,
            originVertex.level,
            subVertices
          );
          setRoot(updatedChildren);
        }
        if (relationsToLoad === 'parentOf') {
          const updatedParents = updateVertexParents(
            root,
            originVertex.id,
            originVertex.level,
            subVertices
          );
          setRoot(updatedParents);
        }
        return true;
      })
      .catch(() => false);
  };

  const getVertexContent = (
    assetName: string,
    dataSourceName: string,
    linkTo?: string,
    vertexAssetId?: string,
    onVertexClick?: (
      vertexAssetId: string,
      vertexAssetName: string,
      vertexDataSourceName: string
    ) => void
  ): ReactElement => (
    <>
      <Tooltip
        title={linkTo ?? vertexAssetId ?? assetName}
        placement="top"
        classes={{
          tooltip: styles.tooltip,
        }}
      >
        {linkTo ? (
          <div
            className={styles.clickableVertex}
            onClick={() => {
              if (vertexAssetId && onVertexClick) {
                onVertexClick(vertexAssetId, assetName, dataSourceName);
              }
            }}
          >
            {assetName}
          </div>
        ) : (
          <div>{assetName}</div>
        )}
      </Tooltip>
      <Tooltip
        title={dataSourceName}
        placement="top-start"
        classes={{
          tooltip: styles.tooltip,
        }}
      >
        <div className={styles.dataSourceLogo}>
          <img
            src={
              dataSourceName === DatasourcesEnum.Airflow
                ? logoAirflow
                : dataSourceName === DatasourcesEnum.Databricks
                ? logoDatabricks
                : dataSourceName === DatasourcesEnum.DeltaLake
                ? logoDelta
                : logoSnow
            }
            alt="logo"
            width={7}
          />
        </div>
      </Tooltip>
    </>
  );

  const loadAssetDownstream = async (
    vertexAssetId: string,
    vertexLevel: number
  ): Promise<boolean> => {
    const relationTypes = queryTypesMap.get(queryType).relationTypes;

    // @ts-ignore
    let lineageFilters = relationTypes.map(relationType => ({
      asset_id: getCorrectedAssetId(
        vertexAssetId,
        dataSource,
        queryType,
        relationType
      ),
      ...(queryType !== QueryTypeEnum.JOB && {
        asset_type: queryTypesMap.get(queryType).assetType,
      }),
      relation_type: relationType,
    }));

    if (queryType === QueryTypeEnum.TABLE) {
      lineageFilters.push({
        asset_id: vertexAssetId,
        relation_type: RelationTypeEnum.DOWNSTREAM,
      });

      // @ts-ignore
      lineageFilters = lineageFilters.map(lf => {
        if (lf.relation_type === RelationTypeEnum.DOWNSTREAM) {
          return {
            asset_id: lf.asset_id,
            relation_type: lf.relation_type,
          };
        } else {
          return { ...lf };
        }
      });
    }

    return queryAssetLineage({
      variables: { lineageFilters: lineageFilters },
    })
      .then(response => {
        if (
          queryType === QueryTypeEnum.PIPELINE
            ? response.data.getPipelineLineage.lineages
            : response.data.getAssetLineage.lineages
        ) {
          const responseLineages =
            queryType === QueryTypeEnum.PIPELINE
              ? response.data.getPipelineLineage.lineages
              : response.data.getAssetLineage.lineages;

          const downstream: Vertex[] = responseLineages
            // @ts-ignore
            .filter((lineage: { dest_id: any; src_id: any }) => {
              const returnedAssetId =
                queryType === QueryTypeEnum.QUERY
                  ? lineage.dest_id
                  : lineage.src_id;

              const correctedAssetId = getCorrectedAssetId(
                vertexAssetId,
                dataSource,
                queryType,
                RelationTypeEnum.DOWNSTREAM
              );

              return (
                returnedAssetId === vertexAssetId ||
                returnedAssetId === correctedAssetId
              );
            })
            // @ts-ignore
            .map(lineage => {
              const queryId =
                queryType === QueryTypeEnum.QUERY
                  ? lineage.src_id
                  : lineage.dest_id;

              return {
                id: lineage.dest_id,
                datasource: lineage.dest_datasource,
                content:
                  queryType === QueryTypeEnum.TABLE ||
                  queryType === QueryTypeEnum.CLONED ||
                  queryType === QueryTypeEnum.COLUMN
                    ? getVertexContent(
                        lineage.dest_name,
                        lineage.dest_datasource,
                        undefined,
                        lineage.dest_id.replace(
                          'disneystreaming.aws_us_east_1.',
                          ''
                        )
                      )
                    : queryType === QueryTypeEnum.QUERY
                    ? getVertexContent(
                        lineage.src_name,
                        lineage.src_datasource,
                        undefined,
                        lineage.src_id
                      )
                    : getVertexContent(
                        lineage.dest_name,
                        lineage.dest_datasource,
                        undefined,
                        lineage.dest_id
                      ),
                tooltip:
                  queryType === QueryTypeEnum.QUERY
                    ? `Query ID: ${lineage.src_id} - User: ${lineage.executed_user} - Exec Time: ${lineage.execution_time}`
                    : lineage.dest_name,
                className: getVertexClassName(lineage.dest_datasource),
                database: getDatabaseName(lineage, RelationTypeEnum.DOWNSTREAM),
                level: vertexLevel + 1,
                groupId: `downstream_${getDatabaseName(
                  lineage,
                  RelationTypeEnum.DOWNSTREAM
                )}_L${vertexLevel + 1}_${vertexAssetId}`,
                groupLabel: getDatabaseName(
                  lineage,
                  RelationTypeEnum.DOWNSTREAM
                ),
                showDetails: showVertexDetails,
                details: getLineageDetails(lineage, 'dest'),
                queryChildrenId: queryId,
                queryParentsId: queryId,
              };
            })
            // @ts-ignore
            .sort((a, b) => (a.database < b.database ? -1 : 1));

          if (QueryTypeEnum.JOB) {
            setRoot(
              updateVertexChildren(
                root,
                vertexAssetId,
                vertexLevel,
                downstream.sort((a, b) =>
                  // @ts-ignore
                  a.datasource < b.datasource ? -1 : 1
                )
              )
            );
          } else {
            setRoot(
              updateVertexChildren(root, vertexAssetId, vertexLevel, downstream)
            );
          }
        }

        return true;
      })
      .catch(() => false);
  };

  const loadAssetUpstream = async (
    vertexAssetId: string,
    vertexLevel: number
  ): Promise<boolean> => {
    const relationTypes = queryTypesMap.get(queryType).relationTypes;

    // @ts-ignore
    let lineageFilters = relationTypes.map(relationType => ({
      asset_id: getCorrectedAssetId(
        vertexAssetId,
        dataSource,
        queryType,
        relationType
      ),
      ...(queryType !== QueryTypeEnum.JOB && {
        asset_type: queryTypesMap.get(queryType).assetType,
      }),
      relation_type: relationType,
    }));

    if (queryType === QueryTypeEnum.TABLE) {
      lineageFilters.push({
        asset_id: vertexAssetId,
        relation_type: RelationTypeEnum.DOWNSTREAM,
      });

      // @ts-ignore
      lineageFilters = lineageFilters.map(lf => {
        if (lf.relation_type === RelationTypeEnum.DOWNSTREAM) {
          return {
            asset_id: lf.asset_id,
            relation_type: lf.relation_type,
          };
        } else {
          return { ...lf };
        }
      });
    }

    return queryAssetLineage({
      variables: { lineageFilters: lineageFilters },
    })
      .then(response => {
        if (
          queryType === QueryTypeEnum.PIPELINE
            ? response.data.getPipelineLineage.lineages
            : response.data.getAssetLineage.lineages
        ) {
          const responseLineages =
            queryType === QueryTypeEnum.PIPELINE
              ? response.data.getPipelineLineage.lineages
              : response.data.getAssetLineage.lineages;

          const upstream: Vertex[] = responseLineages
            .filter(
              // @ts-ignore
              lineage => {
                const returnedAssetId = lineage.dest_id;

                const correctedAssetId = getCorrectedAssetId(
                  vertexAssetId,
                  dataSource,
                  queryType,
                  RelationTypeEnum.DOWNSTREAM
                );

                return (
                  (returnedAssetId === vertexAssetId ||
                    returnedAssetId === correctedAssetId) &&
                  (queryType !== QueryTypeEnum.JOB &&
                  queryType !== QueryTypeEnum.PIPELINE
                    ? !['JOB', 'PIPELINE'].includes(lineage.src_type)
                    : true)
                );
              }
            )
            // @ts-ignore
            .map(lineage => {
              const queryId =
                queryType === QueryTypeEnum.QUERY
                  ? lineage.dest_id
                  : lineage.src_id;
              return {
                id: lineage.src_id,
                datasource: lineage.src_datasource,
                content:
                  queryType === QueryTypeEnum.TABLE ||
                  queryType === QueryTypeEnum.CLONED ||
                  queryType === QueryTypeEnum.COLUMN
                    ? getVertexContent(
                        lineage.src_name,
                        lineage.src_datasource,
                        undefined,
                        lineage.src_id.replace(
                          'disneystreaming.aws_us_east_1.',
                          ''
                        )
                      )
                    : getVertexContent(
                        lineage.src_name,
                        lineage.src_datasource,
                        undefined,
                        lineage.src_id
                      ),
                tooltip:
                  queryType === QueryTypeEnum.QUERY
                    ? `Name: ${lineage.src_name} - User: ${lineage.executed_user} - Exec Time: ${lineage.execution_time}`
                    : lineage.src_name,
                className: getVertexClassName(lineage.src_datasource),
                database: getDatabaseName(lineage, RelationTypeEnum.UPSTREAM),
                level: vertexLevel + 1,
                groupId: `upstream_${getDatabaseName(
                  lineage,
                  RelationTypeEnum.UPSTREAM
                )}_L${vertexLevel + 1}_${vertexAssetId}`,
                groupLabel: getDatabaseName(lineage, RelationTypeEnum.UPSTREAM),
                showDetails: showVertexDetails,
                details: getLineageDetails(lineage, 'src'),
                queryChildrenId: queryId,
                queryParentsId: queryId,
              };
            });

          setRoot(
            updateVertexParents(root, vertexAssetId, vertexLevel, upstream)
          );
        }

        return true;
      })
      .catch(() => false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadAssetJobs = async (
    vertexAssetId: string,
    vertexLevel: number
  ): Promise<boolean> => {
    const relationTypes = queryTypesMap.get(queryType).relationTypes;

    // @ts-ignore
    const lineageFilters = relationTypes.map(relationType => ({
      asset_id: getCorrectedAssetId(
        vertexAssetId,
        dataSource,
        queryType,
        relationType
      ),
      asset_type: queryTypesMap.get(queryType).assetType,
      relation_type: relationType,
    }));

    return queryAssetLineage({
      variables: { lineageFilters: lineageFilters },
    })
      .then(response => {
        if (
          queryType === QueryTypeEnum.PIPELINE
            ? response.data.getPipelineLineage.lineages
            : response.data.getAssetLineage.lineages
        ) {
          const responseLineages =
            queryType === QueryTypeEnum.PIPELINE
              ? response.data.getPipelineLineage.lineages
              : response.data.getAssetLineage.lineages;
          const loadedJobs: Vertex[] = responseLineages
            .filter(
              // @ts-ignore
              lineage =>
                ['JOB', 'PIPELINE'].includes(lineage.src_type) &&
                lineage.src_name
            )
            // @ts-ignore
            .sort(a => (a.src_id.includes('https') ? -1 : 1))
            // @ts-ignore
            .map(lineage => {
              const queryId =
                queryType === QueryTypeEnum.QUERY
                  ? lineage.dest_id
                  : lineage.src_id;

              return {
                id: lineage.src_id,
                name: lineage.src_name,
                datasource: lineage.src_datasource,
                content:
                  queryType === QueryTypeEnum.TABLE ||
                  queryType === QueryTypeEnum.CLONED ||
                  queryType === QueryTypeEnum.COLUMN ? (
                    <LineageVertexContent
                      assetName={
                        lineage.src_name
                          ? lineage.src_name.replace(
                              'disneystreaming.aws_us_east_1.',
                              ''
                            )
                          : ''
                      }
                      dataSourceName={lineage.src_datasource}
                      linkTo={lineage.src_id}
                      vertexAssetId={lineage.src_id}
                      onVertexClick={onVertexClick}
                      nodeType="Datajob"
                      isRootNode
                    />
                  ) : (
                    <LineageVertexContent
                      assetName={lineage.src_name}
                      dataSourceName={lineage.src_datasource}
                      linkTo={lineage.src_id}
                      vertexAssetId={lineage.src_id}
                      onVertexClick={onVertexClick}
                      nodeType="Datajob"
                      isRootNode
                    />
                  ),
                tooltip:
                  queryType === QueryTypeEnum.QUERY
                    ? `Name: ${lineage.src_name} - User: ${lineage.executed_user} - Exec Time: ${lineage.execution_time}`
                    : lineage.src_name,
                level: vertexLevel + 1,
                showDetails: showVertexDetails,
                details: getLineageDetails(lineage, 'src'),
                queryChildrenId: queryId,
                queryParentsId: queryId,
                geometry: {
                  position: { x: 0, y: 0 },
                  dimensions: {
                    height: showVertexDetails
                      ? NODE_HEIGHT_WITH_DETAILS
                      : NODE_HEIGHT,
                    width: NODE_WIDTH,
                  },
                },
              };
            });

          if (loadedJobs.length > 0) {
            setJobs([
              {
                ...loadedJobs[0],
                geometry: {
                  ...root.geometry,
                  dimensions: { ...root.geometry.dimensions },
                },
                hideToggleButton: true,
              },
            ]);
            setEdgeReferences([
              {
                fromId: vertexAssetId,
                toId: loadedJobs[0].id,
              },
            ]);

            if (onLoadedJobs && onVertexClick) {
              onLoadedJobs(
                loadedJobs[0].id,
                //  @ts-ignore
                loadedJobs[0].name,
                //  @ts-ignore
                loadedJobs[0].datasource
              );
            }
          }
        }

        return true;
      })
      .catch(() => false);
  };

  useEffect(() => {
    let nodeType: NodeType = NodeTypeEnum.Dataset;
    if (queryType === QueryTypeEnum.COLUMN) {
      nodeType = 'Field';
    }

    if (datasourceIsDataflow(dataSource)) {
      nodeType = 'Dataflow';
    }
    setRoot(root => ({
      ...root,
      id: getUrn(nodeType, dataSource, assetId),
      content: (
        <LineageVertexContent
          assetName={assetName}
          dataSourceName={dataSource}
          isRootNode
          nodeType={nodeType}
        />
      ),
    }));
  }, [assetId, assetName]);

  const customTools = (): ReactElement[] => [];

  const saveNodesInLocalStorage = (nodes: ObjectsMap): void => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
  };

  const handleOpenChildren = async (vertex: Vertex): Promise<boolean> => {
    if (
      isEnabledDatasource(dataSource) &&
      queryTypesSearchNodes.includes(queryType)
    ) {
      return loadNodes(vertex, 'childOf');
    } else {
      if (dataSource === DatasourcesEnum.Airflow) {
        return loadNodes(vertex, 'childOf');
      }

      const queryId = vertex.queryChildrenId
        ? vertex.queryChildrenId
        : vertex.id;
      return loadAssetDownstream(queryId, vertex.level);
    }
  };

  const handleCloseChildren = async (vertex: Vertex): Promise<boolean> => {
    setRoot(updateVertexChildren(root, vertex.id, vertex.level, []));
    return true;
  };

  const handleOpenParents = async (vertex: Vertex): Promise<boolean> => {
    if (
      isEnabledDatasource(dataSource) &&
      queryTypesSearchNodes.includes(queryType)
    ) {
      return loadNodes(vertex, 'parentOf');
    } else {
      if (dataSource === DatasourcesEnum.Airflow) {
        return loadNodes(vertex, 'parentOf');
      }

      const queryId = vertex.queryParentsId ? vertex.queryParentsId : vertex.id;
      return loadAssetUpstream(queryId, vertex.level);
    }
  };

  const handleCloseParents = async (vertex: Vertex): Promise<boolean> => {
    setRoot(updateVertexParents(root, vertex.id, vertex.level, []));
    return true;
  };

  const handleDownloadButtonClick = (assetId: string): void => {
    setSelectedAssetToDownload(assetId);
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

  return (
    <div className={styles.lineageViewer}>
      <LineageContext.Provider value={{ useNewDesign }}>
        {selectedAssetToDownload && (
          <DownloadDialog
            isOpen={selectedAssetToDownload !== undefined}
            assetId={selectedAssetToDownload}
            assetType={queryType}
            onClose={handleDownloadDialogClose}
            onSubmit={handleDownloadDialogSubmit}
          />
        )}
        {title && <div className={styles.sectionTitle}>{title}</div>}
        <div className={styles.lineageContent}>
          {root.id && (
            <GraphMap
              vertices={[root, ...jobs]}
              loading={loading}
              hideChildrenTooltip={
                queryTypesMap.get(queryType).hideChildrenTooltip
              }
              showChildrenTooltip={
                queryTypesMap.get(queryType).showChildrenTooltip
              }
              hideParentsTooltip={
                queryTypesMap.get(queryType).hideParentsTooltip
              }
              showParentsTooltip={
                queryTypesMap.get(queryType).showParentsTooltip
              }
              showParentsButton={
                queryType === QueryTypeEnum.CLONED ||
                queryType === QueryTypeEnum.QUERY
                  ? false
                  : true
              }
              edgeReferences={edgeReferences}
              showGrouping={showGrouping}
              legend={legend}
              availableViewportHeight={viewportHeight}
              onOpenChildren={handleOpenChildren}
              onCloseChildren={handleCloseChildren}
              onOpenParents={handleOpenParents}
              onCloseParents={handleCloseParents}
              onDownloadButtonClick={handleDownloadButtonClick}
              customTools={customTools()}
              showGroupsHeader={showGroupsHeader}
              showNodesAsSingle={showNodesAsSingle}
            />
          )}
        </div>
      </LineageContext.Provider>
    </div>
  );
};

export default LineageViewer;
