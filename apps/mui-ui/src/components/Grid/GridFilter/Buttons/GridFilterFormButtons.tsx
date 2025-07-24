import { FC } from 'react';
import styles from './../GridFilter.module.scss';

interface Props {
  onApply?: () => void;
  onClear: () => void;
}

const GridFilterFormButtons: FC<Props> = ({ onApply, onClear }) => (
  <div className={styles.gridFilterFormButtons}>
    <button
      className={styles.buttonPrimary}
      onClick={onApply}
      form="filtersForm"
    >
      Apply filters
    </button>
    <button className={styles.buttonSecondary} onClick={onClear}>
      Clear filters
    </button>
  </div>
);

export default GridFilterFormButtons;
