import { FC } from 'react';
import styles from './ErrorMessage.module.scss';

interface Props {
  text: string;
}

const ErrorMessage: FC<Props> = ({ text }) => {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.container}>
        {text && <div className={styles.text}>{text}</div>}
      </div>
    </div>
  );
};

export default ErrorMessage;
