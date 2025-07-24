import { FC, ReactElement, useState } from 'react';
import styles from './CodeDialog.module.scss';
import { Button, Dialog, DialogContent } from '@mui/material';

interface Props {
  label: string | ReactElement;
  code: string;
}

const CodeDialog: FC<Props> = ({ label, code }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.codeDialog}>
      <Button onClick={() => setIsOpen(true)}>{label}</Button>
      <Dialog onClose={handleClose} open={isOpen} maxWidth={'lg'}>
        <DialogContent>
          <pre className={styles.code}>{code}</pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeDialog;
