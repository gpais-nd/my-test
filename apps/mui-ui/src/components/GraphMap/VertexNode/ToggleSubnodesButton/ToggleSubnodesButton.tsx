import { FC, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { ReactComponent as ShowIcon } from './icons/showIcon.svg';
import { ReactComponent as ShowIconHovered } from './icons/showIconHovered.svg';
import { ReactComponent as HideIcon } from './icons/hideIcon.svg';
import { ReactComponent as HideIconHovered } from './icons/hideIconHovered.svg';
import styles from './ToggleSubnodesButton.module.scss';

interface Props {
  isOpen: boolean;
  tooltipOnClosed?: string;
  tooltipOnOpen?: string;
  isLoading: boolean;
  floatSide: 'left' | 'right';
  className?: string;
  classNameSelected?: string;
  classNameLoader?: string;
  onClick: () => Promise<void>;
}

const ToggleSubnodesButton: FC<Props> = ({
  isOpen,
  tooltipOnClosed,
  tooltipOnOpen,
  isLoading = true,
  floatSide,
  className,
  classNameSelected,
  classNameLoader,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.toggleSubnodesButton}>
      <div
        className={`${styles.container} ${
          floatSide === 'left' ? styles.floatLeft : styles.floatRight
        }`}
      >
        <Tooltip
          title={isOpen ? tooltipOnOpen : tooltipOnClosed}
          classes={{
            tooltip: styles.tooltip,
          }}
        >
          <Button
            className={styles.button}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isLoading ? (
              <div className={`${styles.loaderContainer} ${classNameLoader}`}>
                <span className={styles.loader}></span>
              </div>
            ) : isOpen ? (
              isHovered ? (
                <HideIconHovered className={classNameSelected} />
              ) : (
                <HideIcon className={classNameSelected} />
              )
            ) : isHovered ? (
              <ShowIconHovered className={className} />
            ) : (
              <ShowIcon className={className} />
            )}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ToggleSubnodesButton;
