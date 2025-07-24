import { FC } from 'react';
import { Tooltip } from '@mui/material';
import { ReactComponent as JobIcon } from './../icons/jobIcon.svg';
import { ReactComponent as TableIcon } from './../icons/tableIcon.svg';
import { ReactComponent as FieldIcon } from './../icons/fieldIcon.svg';
import styles from './../LineageViewer.module.scss';
import { NodeType } from '../../../../types/entities.types';
import { getLogoByPlatform } from 'utils/datasources.utils';
import { useSelector } from 'react-redux';
import { RootState } from 'sideEffects/reducers';
import { getPlatformById } from 'utils/urls.utils';
interface Props {
  assetName: string;
  dataSourceName: string;
  linkTo?: string;
  vertexAssetId?: string;
  nodeType: NodeType;
  isRootNode?: boolean;
  onVertexClick?: (
    vertexAssetId: string,
    vertexAssetName: string,
    vertexDataSourceName: string
  ) => void;
}

const getNodeTypeIcon = (nodeType: NodeType) => {
  const nodeMapIcon = new Map();
  nodeMapIcon.set('Datajob', <JobIcon />);
  nodeMapIcon.set('Dataset', <TableIcon />);
  nodeMapIcon.set('Field', <FieldIcon />);
  return nodeMapIcon.get(nodeType);
};

const LineageVertexContent: FC<Props> = ({
  assetName,
  dataSourceName,
  linkTo,
  vertexAssetId,
  nodeType,
  isRootNode = false,
  onVertexClick,
}) => {
  const nodeTypeIcon = getNodeTypeIcon(nodeType);
  const { rootHighlighted } = useSelector((state: RootState) => state.app);

  return (
    <div
      className={`${
        isRootNode ? `${styles.rootNode} ${styles[nodeType]}` : styles.node
      } ${rootHighlighted && isRootNode ? `${styles.rootHighlighted}` : ''} `}
    >
      <Tooltip
        title={linkTo ?? vertexAssetId ?? assetName}
        placement="top"
        classes={{
          tooltip: styles.tooltip,
        }}
      >
        <div className={styles.nodeContent}>
          <img
            src={
              dataSourceName
                ? getLogoByPlatform(
                    getPlatformById(vertexAssetId || '')
                      ? getPlatformById(vertexAssetId || '')
                      : dataSourceName
                  )
                : ''
            }
            alt=""
            className={styles.logo}
          />
          <div
            className={`${styles.nodeContentData} ${
              isRootNode ? styles.nodeContentDataRoot : ''
            }`}
          >
            {nodeTypeIcon && (
              <div
                className={`${styles.nodeIconContainer} ${
                  isRootNode ? styles.rootNodeIconContainer : ''
                }`}
              >
                {nodeTypeIcon}
                {isRootNode && (
                  <div
                    className={`${styles.nodeIcon} ${styles[nodeType]}`}
                  ></div>
                )}
              </div>
            )}

            {linkTo ? (
              <div
                className={`${styles.clickableNode} ${styles.nodeTypeName} ${
                  isRootNode ? styles.rootNodeTypeName : ''
                }`}
                onClick={() => {
                  if (vertexAssetId && onVertexClick) {
                    onVertexClick(vertexAssetId, assetName, dataSourceName);
                  }
                }}
              >
                {isRootNode && (
                  <>
                    <div className={styles.nodeType}>{nodeType}</div>
                  </>
                )}
                <div
                  className={`${styles.nodeName} ${
                    isRootNode ? styles.rootNodeName : ''
                  }`}
                >
                  {assetName}
                </div>
              </div>
            ) : (
              <div
                className={`${styles.nodeTypeName} ${
                  isRootNode ? styles.rootNodeTypeName : ''
                }`}
              >
                {isRootNode && (
                  <div className={styles.nodeType}>{nodeType}</div>
                )}
                <div
                  className={`${styles.nodeName} ${
                    isRootNode ? styles.rootNodeName : ''
                  }`}
                >
                  {assetName}
                </div>
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default LineageVertexContent;
