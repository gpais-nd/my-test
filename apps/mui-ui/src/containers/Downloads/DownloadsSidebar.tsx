import { useQuery } from '@apollo/client';
import { Button, Divider, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'sideEffects/reducers';
import { GET_LINEAGE_REQUESTS_STATUS } from './controllers/query';
import {
  DownloadInfo,
  getLineageDirectionIcon,
  LineageRequestStatus,
  mapLineageRequestStatus,
  RequestDetailsProps,
} from './download.utils';
import LineageDownloadsDialog from './DownloadResultsDialog';
import styles from './styles/DownloadsSidebar.module.scss';

const DownloadsSidebar: React.FC = () => {
  const userSub = useSelector(
    (state: RootState) => state.user.personalInfo?.sub
  );
  const { loading, error, data } = useQuery(GET_LINEAGE_REQUESTS_STATUS, {
    variables: { userId: userSub || '', limit: 4 },
  });
  const latestRequests: DownloadInfo[] =
    data?.getLineageRequestsStatus?.result
      .filter((x: LineageRequestStatus) => x.request_name && x.request_status)
      .map(mapLineageRequestStatus) || [];
  const navigate = useNavigate();
  const handleGoToRequests = () => navigate('/downloads');
  const [requestDetailsProps, setRequestDetailsProps] = useState<
    RequestDetailsProps | undefined
  >(undefined);
  const handleRequestDetailsDialogClose = () =>
    setRequestDetailsProps(undefined);

  return (
    <div>
      {requestDetailsProps?.open && (
        <LineageDownloadsDialog {...requestDetailsProps} />
      )}

      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Lineage Downloads</div>

        <div className={styles.latestRequestsTitle}>Latest Requests</div>

        <Divider className={styles.divider} />

        {loading ? (
          <>Loading latest requests...</>
        ) : error ? (
          <>Unable to load latest requests {console.error(error)}</>
        ) : latestRequests.length > 0 ? (
          <List>
            {latestRequests.map((request, index) => (
              <Button
                key={index}
                className={styles.requestButton}
                onClick={() =>
                  setRequestDetailsProps({
                    open: true,
                    onClose: handleRequestDetailsDialogClose,
                    request,
                  })
                }
              >
                <ListItem className={styles.listItem}>
                  <div className={styles.requestContainer}>
                    <div className={styles.requestDetails}>
                      <div className={styles.requestName}>{request.name}</div>
                      <div
                        className={`${styles.requestStatus} ${
                          styles[request.status.toLowerCase()]
                        }`}
                      >
                        {request.status}
                      </div>
                    </div>
                    <div className={styles.requestMeta}>
                      <div className={styles.requestIcon}>
                        {getLineageDirectionIcon(request.direction)}
                        {request.depth}
                      </div>
                      <div className={styles.requestDate}>
                        {request.requestedDate} {request.requestedTime}
                      </div>
                    </div>
                  </div>
                </ListItem>
              </Button>
            ))}
          </List>
        ) : (
          <>
            <div className={styles.noRequestsText}>No Requests Yet!</div>
            <div className={styles.noRequestsDetails}>
              Once you send one you'll be able to check the status and details
              here.
            </div>
          </>
        )}

        <Button
          variant="contained"
          className={styles.goToRequestsButton}
          onClick={handleGoToRequests}
        >
          Go to requests
        </Button>
      </div>
    </div>
  );
};

export default DownloadsSidebar;
