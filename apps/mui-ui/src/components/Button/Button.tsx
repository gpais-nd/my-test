import {
  ComponentPropsWithoutRef,
  FC,
  MouseEventHandler,
  ReactElement,
} from 'react';
import styles from './Button.module.scss';

interface Props extends ComponentPropsWithoutRef<'button'> {
  children?: ReactElement | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button: FC<Props> = ({ children, onClick, className, ...props }) => {
  return (
    <div className={`${styles.button} ${className}`}>
      <button onClick={onClick} {...props}>
        {children}
      </button>
    </div>
  );
};

export default Button;
