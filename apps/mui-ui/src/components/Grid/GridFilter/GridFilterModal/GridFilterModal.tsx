import { FC, ReactElement } from 'react';
import styles from './../GridFilter.module.scss';

interface Props {
  children: ReactElement;
}

const GridFilterModal: FC<Props> = ({ children }) => (
  <div className={styles.gridFilterModal}>
    <div className={styles.gridFilterModalArrow}></div>
    <div className={styles.gridFilterOverlay}>{children}</div>
  </div>
);

export default GridFilterModal;
