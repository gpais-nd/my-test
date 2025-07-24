import { FC } from 'react';
import styles from './Loader.module.scss';

interface Props {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  speed?: 'slow' | 'normal' | 'fast';
}

const Loader: FC<Props> = ({ text, size = 'medium', speed = 'fast' }) => {
  return (
    <div className={styles.loader} data-testid="loader">
      <div className={styles.container}>
        {text && <div className={styles.text}>{text}</div>}
        <div
          className={`${styles.spinnerDual} ${styles[size]} ${styles[speed]}`}
        />
      </div>
    </div>
  );
};

export default Loader;
