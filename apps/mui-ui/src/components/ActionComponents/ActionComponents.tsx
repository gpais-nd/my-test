import { FC, ReactElement } from 'react';
import styles from './ActionComponents.module.scss';

interface Props {
  actionComponents?: ReactElement[];
  className?: string;
}

const ActionComponents: FC<Props> = ({ actionComponents, className }) => (
  <div
    className={`${styles.actionComponents} ${className}`}
    data-testid="actionComponents"
  >
    {actionComponents?.map((actionComponents, index) => (
      <span key={index}>{actionComponents}</span>
    ))}
  </div>
);

export default ActionComponents;
