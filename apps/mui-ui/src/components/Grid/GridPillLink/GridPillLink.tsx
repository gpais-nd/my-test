import { FC } from 'react';
import styles from '../Grid.module.scss';
import ExternalLinkIcon from 'assets/icons/ExternalLinkIcon';

export type LinkType = 'primary' | 'secondary' | 'tertiary';

interface Props {
  type?: LinkType;
  label: string;
  url: string;
}

const GridPillLink: FC<Props> = ({ type = 'primary', label, url }) => {
  return (
    <div className={styles.gridPillLink}>
      <div className={`${styles.pill} ${styles[type]}`}>
        <a href={url} target="_blank" rel="noreferrer">
          {label} <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
};

export default GridPillLink;
