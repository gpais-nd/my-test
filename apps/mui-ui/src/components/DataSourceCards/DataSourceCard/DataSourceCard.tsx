import { FC } from 'react';
import { DataSource } from 'types/entities.types';
import { Link } from 'react-router-dom';
import styles from '../DataSourceCards.module.scss';
import { getLogoByPlatform } from 'utils/datasources.utils';

interface Props {
  dataSource: DataSource;
  label?: string;
  beta?: boolean;
}

const DataSourceCard: FC<Props> = ({
  dataSource,
  label = 'Tables',
  beta = false,
}) => {
  if (!dataSource.isEnabled) {
    return null;
  }
  return (
    <div className={styles.dataSource}>
      <Link to={`/dataSource/${dataSource.name}`}>
        <div className={styles.dataSourcePane}></div>
        <img
          className={styles.dataSourcePaneLogo}
          src={getLogoByPlatform(dataSource.name)}
          alt="logo"
        />
        <div className={styles.dataSourceInfo}>
          <div className={styles.dataSourceName}>
            {dataSource.dataSourceLabel ?? dataSource.name}
          </div>
          <div className={styles.dataSourceTables}>
            {dataSource.numberOfTables} {label}
          </div>
          {beta && <p className={styles.dataSourceBeta}>Beta</p>}
        </div>
      </Link>
    </div>
  );
};

export default DataSourceCard;
