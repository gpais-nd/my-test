import React, { memo, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Handle, Position } from '@xyflow/react';
import { Plus, Minus } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import styles from './LineageFlow.module.scss';
import { NodeFlowDataNode } from 'types/flow.types';
import { getPlatformIcon, getNodeTypeIcon } from 'utils/datasources.utils';
import downloadIcon from './icons/download.svg';

interface CustomNodeProps {
  id: string;
  data: NodeFlowDataNode;
}

const LineageFlowMainNode = ({ id, data }: CustomNodeProps) => {
  const [leftButtonOpen, setLeftButtonOpen] = React.useState(false);
  const [rightButtonOpen, setRightButtonOpen] = React.useState(false);
  const icon = getNodeTypeIcon(data?.nodeType || '');

  const handleOpenChildren = useCallback(() => {
    setRightButtonOpen(!rightButtonOpen);
    if (rightButtonOpen) {
      data.onContractRight?.(id, data.nodeSide || 'childOf');
    } else {
      data.onExpandRight?.(id, data.depth || 0);
    }
  }, [rightButtonOpen, id, data]);

  const handleOpenParent = useCallback(() => {
    setLeftButtonOpen(!leftButtonOpen);
    if (leftButtonOpen) {
      data.onContractLeft?.(id, data.nodeSide || 'parentOf');
    } else {
      data.onExpandLeft?.(id, data.depth || 0);
    }
  }, [leftButtonOpen, id, data]);

  const handleDownloadLineage = (id: string | undefined) => {
    if (id) {
      data.onDownloadNode?.(id);
    }
  };

  return (
    <div className={styles.rootNode}>
      <img
        className={styles.icon}
        src={getPlatformIcon(data?.dataSource || '')}
        alt="ds-icon"
      />
      <div className={styles.infoSection}>
        <div className={styles.actionSection}>
          <div className={styles.actionIcon}>
            <Tooltip title={data?.nodeType}>
              <img className={styles.iconQuery} src={icon} alt="ds-icon" />
            </Tooltip>
            <Tooltip title={data.label}>
              <p>{data.label}</p>
            </Tooltip>
          </div>
          {data.isDownloadActive && (
            <button
              onClick={() => handleDownloadLineage(data?.id)}
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
      </div>

      <button
        className={`${styles.nodesButton} ${styles.buttonLeft}`}
        onClick={handleOpenParent}
        title="Add parent nodes to the left"
      >
        {leftButtonOpen ? <Minus color="#fff" /> : <Plus color="#fff" />}
      </button>

      <button
        className={`${styles.nodesButton} ${styles.buttonRight}`}
        onClick={handleOpenChildren}
        title="Add child nodes to the right"
      >
        {rightButtonOpen ? <Minus color="#fff" /> : <Plus color="#fff" />}
      </button>

      <Handle
        type="target"
        style={{
          background: 'transparent',
          border: 'none',
        }}
        id="target-left"
        position={Position.Left}
      />
      <Handle
        type="target"
        style={{
          background: 'transparent',
          border: 'none',
        }}
        id="target-right"
        position={Position.Right}
      />
      <Handle
        type="source"
        className={styles.handle}
        style={{
          background: 'transparent',
          border: 'none',
        }}
        id="source-left"
        position={Position.Left}
      />
      <Handle
        type="source"
        className={styles.handle}
        style={{
          background: 'transparent',
          border: 'none',
        }}
        id="source-right"
        position={Position.Right}
      />
    </div>
  );
};

export default memo(LineageFlowMainNode);
