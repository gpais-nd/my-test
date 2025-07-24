import { FC, ReactElement } from 'react';
import styles from './GroupButton.module.scss';

interface Props {
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: ReactElement;
  isDisabled?: boolean;
  className?: string;
  onClick: () => void;
}

const GroupButton: FC<Props> = ({
  label,
  variant = 'primary',
  icon,
  isDisabled,
  className,
  onClick,
}) => {
  return (
    <button
      className={`${styles.groupButton} ${styles[variant]} ${
        isDisabled ? styles.disabled : ''
      } ${className}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.icon}>{icon}</div>
    </button>
  );
};

export default GroupButton;
