import { FC } from 'react';
import GridCloseFilterIcon from '../images/GridCloseFilterIcon';
import GridOpenFilterIcon from '../images/GridOpenFilterIcon';
import styles from './../GridFilter.module.scss';
import { Button } from '../../../Button';

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

const GridToggleFilterButton: FC<Props> = ({ isOpen, onClick }) => {
  return (
    <div className={styles.gridFilterButton}>
      <Button
        onClick={onClick}
        type={'button'}
        aria-label="Grid Toggle Filter Button"
      >
        {isOpen ? <GridCloseFilterIcon /> : <GridOpenFilterIcon />}
      </Button>
    </div>
  );
};

export default GridToggleFilterButton;
