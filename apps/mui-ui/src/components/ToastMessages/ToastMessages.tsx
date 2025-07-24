import { FC, useEffect, useState } from 'react';
import styles from './ToastMessages.module.scss';
import { ToastMessage } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'sideEffects/reducers';
import { removeToastMessage } from '../../sideEffects/actions/gui.actions';
import Toast from './Toast/Toast';

const ToastMessages: FC = () => {
  const dispatch = useDispatch();
  const [toastTimers, setToastTimers] = useState<number[]>([]);
  const toastMessages = useSelector(
    (state: RootState) => state.gui.toastMessages
  );

  useEffect(() => {
    setToastsTimeouts(toastMessages);
  }, [toastMessages]);

  const setToastsTimeouts = (toastMessages: ToastMessage[]): void => {
    toastMessages.forEach(toastMessage => {
      if (
        toastMessage.id &&
        toastMessage.timeout &&
        !toastTimers.find(toastTimer => toastTimer === toastMessage.id)
      ) {
        setTimeout(() => {
          handleClose(toastMessage.id);
        }, toastMessage.timeout);
        setToastTimers([...toastTimers, toastMessage.id]);
      }
    });
  };

  const handleClose = (toastMessageId?: number): void => {
    if (toastMessageId) {
      dispatch(removeToastMessage(toastMessageId));
    }
  };

  return (
    <div className={styles.toastContainer} data-testid="toastMessages">
      {toastMessages.map(toastMessage => (
        <Toast
          key={toastMessage.id}
          toastMessage={toastMessage}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default ToastMessages;
