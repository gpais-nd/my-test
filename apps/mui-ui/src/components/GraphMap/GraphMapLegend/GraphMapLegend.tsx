import { FC, ReactElement } from 'react';
import styles from './GraphMapLegend.module.scss';

interface Props {
  children?: ReactElement;
}

const GraphMapLegend: FC<Props> = ({ children }) => {
  return (
    <>{children && <div className={styles.graphMapLegend}>{children}</div>}</>
  );
};

export default GraphMapLegend;
