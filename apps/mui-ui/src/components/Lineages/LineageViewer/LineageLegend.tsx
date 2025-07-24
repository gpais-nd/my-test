import { FC, ReactNode } from 'react';
import styles from './LineageViewer.module.scss';

interface Props {
  children: ReactNode;
}

export const LineageLegendInternal: FC<Props> = ({ children }) => {
  return <div className={styles.sectionLegendInternal}>{children}</div>;
};

const LineageLegend: FC<Props> = ({ children }) => {
  return <div className={styles.sectionLegend}>{children}</div>;
};

export default LineageLegend;
