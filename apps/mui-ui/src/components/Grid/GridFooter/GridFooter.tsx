import { FC, ReactElement } from 'react';
import styles from './../Grid.module.scss';

interface Props {
  children?: ReactElement;
}

const GridFooter: FC<Props> = ({ children }) => {
  return <footer className={styles.footer}>{children}</footer>;
};

export default GridFooter;
