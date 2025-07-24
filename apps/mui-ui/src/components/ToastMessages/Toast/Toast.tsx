import { FC } from 'react';
import { ToastMessage } from '../types';
import { Button } from 'components/Button';
import styles from '../ToastMessages.module.scss';

interface Props {
  toastMessage: ToastMessage;
  onClose: (toastMessageId?: number) => void;
}

const Toast: FC<Props> = ({ toastMessage, onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[toastMessage.variant]}`}>
      {toastMessage.timeout && (
        <div className={styles.timeout}>
          <span className={styles.loader}></span>
        </div>
      )}
      <Button
        className={styles.button}
        onClick={() => onClose(toastMessage.id)}
        data-testid="toastCloseButton"
      >
        X
      </Button>
      {toastMessage.content}
    </div>
  );
};

export default Toast;
