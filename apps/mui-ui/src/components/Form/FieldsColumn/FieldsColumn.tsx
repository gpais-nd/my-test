import { FC, ReactNode } from 'react';
import styles from './FieldsColumn.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

const FieldsColumn: FC<Props> = ({ children, className }) => {
  return (
    <div className={`${styles.fieldsColumn} ${className ?? ''}`}>
      {children}
    </div>
  );
};

export default FieldsColumn;
