import { useQuery } from '@apollo/client';
import {
  Checkbox,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Loader } from 'components/Loader';
import { downloadAssetFromS3 } from '../../hooks/useAwsRequests';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'sideEffects/reducers';
import { GET_LINEAGE_REQUESTS_STATUS } from './controllers/query';
import {
  DownloadInfo,
  getLineageDirectionIcon,
  mapLineageRequestStatus,
  RequestDetailsProps,
  Status,
} from './download.utils';
import LineageDownloadsDialog from './DownloadResultsDialog';
import styles from './styles/DownloadResultsTable.module.scss';
import { ReactComponent as NoRequestsIcon } from './images/noRequestsIcon.svg';
import { ReactComponent as LeftChevronIcon } from './images/leftChevronIcon.svg';
import { ReactComponent as RightChevronIcon } from './images/rightChevronIcon.svg';

const DownloadResultsTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [requestIdsToDownload, setRequestIdsToDownload] = useState<string[]>(
    []
  );
  const userSub = useSelector(
    (state: RootState) => state.user.personalInfo?.sub
  );
  const { loading, error, data } = useQuery(GET_LINEAGE_REQUESTS_STATUS, {
    variables: {
      userId: userSub || '',
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    },
  });
  const latestRequests: DownloadInfo[] =
    data?.getLineageRequestsStatus?.result.map(mapLineageRequestStatus) || [];
  const rowCount: number =
    (data?.getLineageRequestsStatus?.row_count as number) ||
    latestRequests.length;

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(event.target.value as number);
    setPage(0);
  };

  const handleCheckbox = (id: string) => {
    if (requestIdsToDownload.includes(id)) {
      setRequestIdsToDownload(requestIdsToDownload.filter(item => item != id));
    } else {
      setRequestIdsToDownload([...requestIdsToDownload, id]);
    }
  };

  const [requestDetailsProps, setRequestDetailsProps] = useState<
    RequestDetailsProps | undefined
  >(undefined);
  const handleRequestDetailsDialogClose = (): void => {
    setRequestDetailsProps(undefined);
  };

  if (loading) return <Loader text="Loading latest requests..." />;
  if (error) return <>Unable to load latest requests {console.error(error)}</>;
  return (
    <>
      {latestRequests.length ? (
        <>
          {requestDetailsProps?.open && (
            <LineageDownloadsDialog {...requestDetailsProps} />
          )}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{/* Placeholder for checkbox */}</th>
                  <th className={styles.columnHeader}>Request Name</th>
                  <th className={styles.columnHeader}>Status</th>
                  <th className={styles.columnHeader}>Direction</th>
                  <th className={styles.columnHeader}>Depth</th>
                  <th className={styles.columnHeader}>Date and Time</th>
                  <th>
                    <button
                      className={styles.downloadButton}
                      disabled={requestIdsToDownload.length === 0}
                      onClick={() => {
                        latestRequests.forEach(request => {
                          if (
                            requestIdsToDownload.includes(request.requestId)
                          ) {
                            downloadAssetFromS3(
                              request.outputS3PathUrl,
                              request.name
                            );
                          }
                        });
                      }}
                    >
                      Download
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {latestRequests.map((request, index) => (
                  <tr
                    key={index}
                    className={`${styles.tableRow}
                      ${
                        requestIdsToDownload.includes(request.requestId)
                          ? styles.selected
                          : ''
                      }`}
                    onClick={() =>
                      setRequestDetailsProps({
                        open: true,
                        onClose: handleRequestDetailsDialogClose,
                        request: request,
                      })
                    }
                  >
                    <td
                      className={styles.tableData}
                      onClick={e => e.stopPropagation()}
                    >
                      <Checkbox
                        disabled={request.status != Status.COMPLETED}
                        checked={requestIdsToDownload.includes(
                          request.requestId
                        )}
                        onChange={() => {
                          handleCheckbox(request.requestId);
                        }}
                      />
                    </td>
                    <td className={`${styles.requestName} ${styles.tableData}`}>
                      {request.name}
                    </td>
                    <td className={styles.tableData}>
                      <div
                        className={`${styles.status} ${
                          styles[request.status.toLowerCase()]
                        }`}
                      >
                        {request.status}
                      </div>
                    </td>
                    <td className={styles.tableData}>
                      {getLineageDirectionIcon(request.direction)}
                    </td>
                    <td className={styles.tableData}>{request.depth}</td>
                    <td className={styles.tableData} colSpan={2}>
                      {request.requestedDate} - {request.requestedTime}
                    </td>
                    <td>{/* Placeholder for download button */}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className={styles.tableFooter} colSpan={7}>
                    <div className={styles.pagination}>
                      <IconButton
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                      >
                        <LeftChevronIcon />
                      </IconButton>
                      <p>
                        {page * rowsPerPage + 1}-
                        {Math.min((page + 1) * rowsPerPage, rowCount)} of{' '}
                        {rowCount}
                      </p>
                      <IconButton
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil(rowCount / rowsPerPage) - 1}
                      >
                        <RightChevronIcon />
                      </IconButton>
                      <label>
                        Rows per page:{' '}
                        <Select
                          value={rowsPerPage}
                          onChange={handleChangeRowsPerPage}
                          label="Rows per page: "
                        >
                          {[5, 10, 25].map(size => (
                            <MenuItem key={size} value={size}>
                              {size}
                            </MenuItem>
                          ))}
                        </Select>
                      </label>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <div className={styles.noRequests}>
          <NoRequestsIcon />
          <div className={styles.message}>No requests yet!</div>
          <div className={styles.subtext}>
            Once you send one you'll be able to track the status and details
            here.
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadResultsTable;
