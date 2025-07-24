import React, { memo, useCallback, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, Minus } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import styles from './LineageFlow.module.scss';
import { NodeFlowDataNode } from 'types/flow.types';
import downloadIcon from './icons/download.svg';
import { getNodeColor } from './LineageFlowHelpers';
import { getPlatformIcon, getNodeTypeIcon } from 'utils/datasources.utils';

interface CustomNodeProps {
  id: string;
  data: NodeFlowDataNode;
}

const LineageFlowNode = ({ id, data }: CustomNodeProps) => {
  const [rightExpanded, setRightExpanded] = React.useState(
    data?.isExpandedRight ?? false
  );

  const [leftExpanded, setLeftExpanded] = React.useState(
    data?.isExpandedLeft ?? false
  );

  useEffect(() => {
    data.isExpandedRight = rightExpanded;
    data.isExpandedLeft = leftExpanded;
  }, [rightExpanded, leftExpanded]);

  const handleOpenChildren = useCallback(() => {
    if (data?.isExpandedRight) {
      data.onContractRight?.(id, data.nodeSide || 'childOf');
      data.isExpandedRight = false;
      setRightExpanded(false);
    } else {
      data.onExpandRight?.(id, data.depth || 0);
      data.isExpandedRight = true;
      setRightExpanded(true);
    }
  }, [data?.isExpandedRight, id]);

  const handleOpenParent = useCallback(() => {
    if (data?.isExpandedLeft) {
      data.onContractLeft?.(id, data.nodeSide || 'parentOf');
      data.isExpandedLeft = false;
      setLeftExpanded(false);
    } else {
      data.onExpandLeft?.(id, data.depth || 0);
      data.isExpandedLeft = true;
      setLeftExpanded(true);
    }
  }, [data.isExpandedLeft, id]);

  const onDownloadNode = (nodeId: string | undefined) => {
    if (nodeId) {
      data.onDownloadNode?.(nodeId);
    }
  };

  return (
    <div
      className={`${styles.customNode} ${
        data?.isHighlighted ? styles.highlighted : ''
      } ${data.isSelected ? styles.selected : ''}`}
    >
      <div className={styles.infoCustomSection}>
        <div
          className={`${styles.depthLevel} ${styles.depthContainer}`}
          style={{ backgroundColor: getNodeColor(data?.depth) }}
        >
          <p>{data.depth}</p>
        </div>
        <div>
          <Tooltip title={data.nodeType}>
            <img
              className={styles.icon}
              src={getNodeTypeIcon(data.nodeType ?? '')}
              alt="ds-icon"
            />
          </Tooltip>
          <img
            className={styles.icon}
            src={getPlatformIcon(data.dataSource || '')}
            alt="ds-icon"
          />
          <Tooltip title={id?.split('|')[0]}>
            <p>{data?.label?.toString().toLowerCase()}</p>
          </Tooltip>
        </div>
        {data.isDownloadActive && (
          <button
            onClick={() => onDownloadNode(id)}
            title="Download"
            className={styles.buttonIcon}
          >
            <img
              className={styles.iconQuery}
              src={downloadIcon}
              alt="ds-icon"
            />
          </button>
        )}
      </div>
      {data?.nodeSide === 'parentOf' && (
        <button
          className={`${styles.nodesButton} ${styles.buttonLeft}`}
          onClick={handleOpenParent}
          title="Add parent nodes to the left"
          onMouseDown={e => e.stopPropagation()}
          onMouseDownCapture={e => e.stopPropagation()}
        >
          {leftExpanded ? <Minus color="#fff" /> : <Plus color="#fff" />}
        </button>
      )}

      {data?.nodeSide === 'childOf' && (
        <button
          className={`${styles.nodesButton} ${styles.buttonRight}`}
          onClick={handleOpenChildren}
          title="Add child nodes to the right"
          onMouseDown={e => e.stopPropagation()}
          onMouseDownCapture={e => e.stopPropagation()}
        >
          {rightExpanded ? <Minus color="#fff" /> : <Plus color="#fff" />}
        </button>
      )}

      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{
          background: 'transparent',
          border: 'none',
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        style={{
          background: 'transparent',
          border: 'none',
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        style={{
          background: 'transparent',
          border: 'none',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{
          background: 'transparent',
          border: 'none',
        }}
      />
    </div>
  );
};

export default memo(LineageFlowNode);
