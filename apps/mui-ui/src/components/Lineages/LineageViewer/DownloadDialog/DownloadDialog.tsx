import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  handleEmptyRequestName,
  LineageDownloadDirection,
} from 'containers/Downloads/download.utils';
import React, { FC, useState } from 'react';
import { capitalizeFirstLetter } from '../../../../utils/string.utils';

interface Props {
  isOpen: boolean;
  assetId: string;
  assetType: string;
  onClose: () => void;
  onSubmit: (
    selectedAssetId: string,
    depth: number,
    direction: LineageDownloadDirection,
    requestName?: String
  ) => void;
}

const DownloadDialog: FC<Props> = ({
  isOpen,
  assetId,
  assetType,
  onClose,
  onSubmit,
}) => {
  const [selectedLineageDirection, setSelectedLineageDirection] =
    useState<LineageDownloadDirection>(LineageDownloadDirection.UPSTREAM);
  const [textfieldError, setTextfieldError] = useState<boolean>(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const depth = formJson.depth;
    const direction = formJson.direction;
    const requestName = formJson.requestName.trim();
    onSubmit(assetId, depth, direction, requestName);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{`${capitalizeFirstLetter(
        assetType
      )} Lineage Report`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the form below to request a lineage download. You
          recieve an email notification once the job is completed. From there,
          you can navigate to the OMS homepage to view your available downloads.
        </DialogContentText>
        <Tooltip title={assetId} placement="top">
          <TextField
            label="Asset"
            variant="outlined"
            fullWidth
            margin="normal"
            value={assetId}
            disabled
          />
        </Tooltip>
        <TextField
          label="Request name"
          name="requestName"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          error={textfieldError}
          onChange={event => handleEmptyRequestName(event, setTextfieldError)}
        />
        <p style={{ fontSize: '14px', margin: '0 0 0.5rem 0' }}>
          We recommend using a unique and descriptive name for easier
          identification
        </p>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="dropdown-label">Lineage Direction</InputLabel>
          <Select
            labelId="Direction"
            name="direction"
            value={selectedLineageDirection}
            onChange={event =>
              setSelectedLineageDirection(
                event.target.value as LineageDownloadDirection
              )
            }
            label="Select Lineage Direction"
          >
            <MenuItem value={LineageDownloadDirection.UPSTREAM}>
              Upstream
            </MenuItem>
            <MenuItem value={LineageDownloadDirection.DOWNSTREAM}>
              Downstream
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Depth"
          name="depth"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: 30 }}
          defaultValue={1}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
