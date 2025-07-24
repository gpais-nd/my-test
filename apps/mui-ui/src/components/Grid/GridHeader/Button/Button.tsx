import { FC, MouseEventHandler, ReactElement } from 'react';
import styles from './Button.module.scss';
import IconPencil from './images/icon_pencil.svg';

export enum ButtonIconType {
  EDIT = 'EDIT',
}

const icons = {
  EDIT: <img className={styles.icon} src={IconPencil} alt="Edit" />,
};

interface Props {
  children: ReactElement | string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  iconType?: ButtonIconType;
  formName?: string;
  className?: string;
}

const Button: FC<Props> = ({
  children,
  onClick,
  iconType,
  formName,
  className,
}) => {
  return (
    <div className={`${styles.button} ${className}`}>
      <button
        onClick={onClick}
        type={!formName ? 'button' : undefined}
        form={formName}
      >
        <span className={styles.buttonName}>{children}</span>
        {iconType ? icons[iconType] : <></>}
      </button>
    </div>
  );
};

export default Button;
