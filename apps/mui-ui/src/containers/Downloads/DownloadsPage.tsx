import React from 'react';
import BulkDownload from './BulkDownload';
import DownloadResultsTable from './DownloadResultsTable';
import styles from './styles/DownloadsPage.module.scss';

const DownloadsPage: React.FC = () => {
  return (
    <>
      <h3 className={styles.header}>Lineage Downloads</h3>
      <div className={styles.content}>
        <div className={styles.bulkDownload}>
          <BulkDownload />
        </div>
        <div className={styles.downloadResultsTable}>
          <DownloadResultsTable />
        </div>
      </div>
    </>
  );
};

export default DownloadsPage;
