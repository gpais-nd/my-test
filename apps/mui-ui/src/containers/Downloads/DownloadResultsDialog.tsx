import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import { downloadAssetFromS3 } from 'hooks/useAwsRequests';
import React from 'react';
import { RequestDetailsProps, Status } from './download.utils';
import styles from './styles/DownloadResultsDialog.module.scss';

const DownloadResultsDialog: React.FC<
  RequestDetailsProps
> = requestDetailsProps => {
  const { open, onClose, request } = requestDetailsProps;
  const GridItem: React.FC<{ title: string; value: any }> = ({
    title,
    value,
  }) => {
    return (
      <div className={styles.gridItemTitle}>
        {title}
        <div className={styles.gridItemValue}>{value.toString()}</div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <div className={styles.requestName}>{request.name}</div>
          </Grid>
          <Grid className={styles.headerDetails}>
            <div
              className={`${styles.status} ${
                styles[request.status.toLowerCase()]
              }`}
            >
              {request.status}
            </div>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <DialogActions>
          {request.status == Status.COMPLETED && (
            <button
              onClick={() => {
                downloadAssetFromS3(request.outputS3PathUrl, request.name);
              }}
              className={styles.downloadButton}
            >
              Download
            </button>
          )}
        </DialogActions>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <GridItem title={'Request ID'} value={request.requestId} />
            <GridItem title={'Assets ID'} value={request.assetsId} />
            <GridItem title={'Requested Date'} value={request.requestedDate} />
            <GridItem title={'Requested Time'} value={request.requestedTime} />
            <GridItem
              title={'Number of Assets Requested'}
              value={request.assetsRequested}
            />
            <GridItem
              title={'Number of Assets Processed'}
              value={request.assetsProcessed}
            />
            <GridItem
              title={'Number of Assets Failed'}
              value={request.assetsFailed}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <GridItem title={'Lineage Direction'} value={request.direction} />
            <GridItem title={'Depth'} value={request.depth} />
            <GridItem title={'Date Completed'} value={request.dateCompleted} />
            <GridItem title={'Archived'} value={request.archived} />
            <GridItem title={'Failed Assets'} value={request.failedAssets} />
            <GridItem title={'Comments'} value={request.comments} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadResultsDialog;
