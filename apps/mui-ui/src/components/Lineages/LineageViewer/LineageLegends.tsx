import { ReactElement } from 'react';
import LineageLegend, { LineageLegendInternal } from './LineageLegend';
import styles from './LineageViewer.module.scss';

export const LegendTable = (): ReactElement => (
  <LineageLegend>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.upstream}`}>Upstream</span>
    </LineageLegendInternal>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.downstream}`}>Downstream</span>
    </LineageLegendInternal>
  </LineageLegend>
);

export const LegendCloned = (): ReactElement => (
  <LineageLegend>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.downstream}`}>
        Cloned From
      </span>
    </LineageLegendInternal>
  </LineageLegend>
);

export const LegendQuery = (): ReactElement => (
  <LineageLegend>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.downstream}`}>Refers</span>
    </LineageLegendInternal>
  </LineageLegend>
);

export const LegendCw = (): ReactElement => (
  <LineageLegend>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.upstream}`}>Upstream</span>
    </LineageLegendInternal>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.downstream}`}>Downstream</span>
    </LineageLegendInternal>
  </LineageLegend>
);
export const LegendJobs = (): ReactElement => (
  <LineageLegend>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.upstream}`}>Upstream</span>
    </LineageLegendInternal>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.downstream}`}>Downstream</span>
    </LineageLegendInternal>
  </LineageLegend>
);

export const LegendPipeline = (): ReactElement => (
  <LineageLegend>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.upstream}`}>Upstream</span>
    </LineageLegendInternal>
    <LineageLegendInternal>
      <span className={`${styles.block} ${styles.downstream}`}>Downstream</span>
    </LineageLegendInternal>
  </LineageLegend>
);
