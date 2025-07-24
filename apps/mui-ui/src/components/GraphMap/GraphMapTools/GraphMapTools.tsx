import React, { FC, RefObject, ReactElement } from 'react';
import { Button, SelectChangeEvent, Tooltip } from '@mui/material';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import styles from './GraphMapTools.module.scss';

interface Props {
  availableGroupNames: string[];
  filteredGroupNames: string[];
  showGrouping: boolean;
  centerButtonRef?: RefObject<HTMLButtonElement>;
  customTools?: ReactElement[];
  onFilteredGroupsChange?:
    | ((event: SelectChangeEvent<string[]>, child: React.ReactNode) => void)
    | undefined;
  onSelectAllGroups?: () => void;
  onDeselectAllGroups?: () => void;
  onCenter?: () => void;
}

const GraphMapTools: FC<Props> = ({
  showGrouping,
  centerButtonRef,
  customTools,
  onCenter,
}) => {
  const handleCenterButtonClick = (): void => {
    if (onCenter) {
      onCenter();
    }
  };

  return (
    <div className={styles.tools}>
      {showGrouping && (
        <>
          <div className={styles.colorsGroup}>
            <p>
              <span className={styles.dataset}></span>Dataset
            </p>
            <p>
              <span className={styles.dataflow}></span>Dataflow
            </p>
          </div>
        </>
      )}
      {customTools?.map((tool, index) => (
        <div key={index}>{tool}</div>
      ))}
      <Tooltip
        title="Center start node"
        placement="bottom"
        classes={{
          tooltip: styles.tooltip,
        }}
      >
        <Button
          ref={centerButtonRef}
          className={styles.button}
          variant="contained"
          onClick={handleCenterButtonClick}
        >
          <CenterFocusStrongIcon />
        </Button>
      </Tooltip>
    </div>
  );
};

export default GraphMapTools;
