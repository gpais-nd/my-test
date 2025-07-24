import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';
import ArrowIcon from './images/ArrowIcon';
import { Tooltip } from '@mui/material';

interface Props {
  path: string;
}

const Breadcrumbs: FC<Props> = ({ path }) => (
  <div className={styles.breadcrumbs}>
    <Tooltip title="Back to list">
      <Link className={styles.link} to={path}>
        <ArrowIcon />
      </Link>
    </Tooltip>
  </div>
);

export default Breadcrumbs;
