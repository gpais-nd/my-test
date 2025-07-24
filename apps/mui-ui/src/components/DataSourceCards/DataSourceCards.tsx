import { FC } from 'react';
import { DataSource } from 'types/entities.types';
import styles from './DataSourceCards.module.scss';
import { DataSourceCard } from './DataSourceCard';
import { Link } from '../../types/utils.types';

interface Props {
  dataSources: DataSource[];
  links?: Link[];
}

const DataSourceCards: FC<Props> = ({ dataSources }) => {
  const datasourcesTable = dataSources.filter(
    dataSource => dataSource.category === 'table'
  );

  const datasourcesJob = dataSources.filter(
    dataSource => dataSource.category === 'job'
  );

  const datasourcesStream = dataSources.filter(
    dataSource => dataSource.category === 'stream'
  );

  const datasourcesReports = dataSources.filter(
    dataSource => dataSource.category === 'reports'
  );

  return (
    <div className={styles.dataSourceCardsContainer}>
      <div className={styles.dataSourceCard}>
        <div className={styles.header}>Tables</div>
        <div className={styles.cards}>
          {datasourcesTable.map(dataSource => (
            <DataSourceCard
              key={dataSource.id}
              dataSource={dataSource}
              label={dataSource.label}
            />
          ))}
        </div>
      </div>

      <div className={styles.dataSourceCard}>
        <div className={styles.header}>Pipelines</div>
        <div className={styles.cards}>
          {datasourcesJob.map(dataSource => (
            <DataSourceCard
              key={dataSource.id}
              dataSource={dataSource}
              label={dataSource.label}
            />
          ))}
        </div>
      </div>
      <div className={styles.dataSourceCard}>
        <div className={styles.header}>Streams</div>
        <div className={styles.cards}>
          {datasourcesStream.map(dataSource => (
            <DataSourceCard
              key={dataSource.id}
              dataSource={dataSource}
              label={dataSource.label}
            />
          ))}
        </div>
      </div>
      <div className={styles.dataSourceCard}>
        <div className={styles.header}>Reports</div>
        <div className={styles.cards}>
          {datasourcesReports.map(dataSource => (
            <DataSourceCard
              key={dataSource.id}
              dataSource={dataSource}
              label={dataSource.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSourceCards;
