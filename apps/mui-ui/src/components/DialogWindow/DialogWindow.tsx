import React, { FC, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './DialogWindow.module.scss';
import styled from 'styled-components';

interface Props {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  modalClose: () => void;
}

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiDialogContent-root': {
    padding: '10px',
  },
  '& .MuiDialogActions-root': {
    padding: '10px',
  },
}));

const DialogWindow: FC<Props> = ({
  title,
  children,
  modalClose,
  isOpen = false,
}) => {
  const [open, setOpen] = React.useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onClose = () => {
    setOpen(false);
    modalClose();
  };

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={styles.dialog}
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
    </BootstrapDialog>
  );
};

export default DialogWindow;
