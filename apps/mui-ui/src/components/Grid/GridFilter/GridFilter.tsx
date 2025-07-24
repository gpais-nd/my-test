import { FC, ReactElement, useEffect, useState } from 'react';
import { GridToggleFilterButton } from './Buttons';
import { CSSSizeValue } from 'types/utils.types';
import { GridFilterModal } from './GridFilterModal';
import styles from './GridFilter.module.scss';
import GridFilterFormButtons from './Buttons/GridFilterFormButtons';

interface Props {
  children: ReactElement;
  stickyFromTop?: CSSSizeValue;
  onClearFilters?: () => void;
}

const GridFilter: FC<Props> = ({ children, stickyFromTop, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [children]);

  const handleClick = (): void => {
    setIsOpen(!isOpen);
  };

  const handleClearClick = (): void => onClearFilters && onClearFilters();

  return (
    <div
      className={`${styles.gridFilter} ${
        stickyFromTop !== undefined ? 'defaultSticky' : undefined
      }`}
      style={{ top: stickyFromTop }}
    >
      <GridToggleFilterButton isOpen={isOpen} onClick={handleClick} />
      {isOpen && (
        <GridFilterModal>
          <>
            {children}
            <GridFilterFormButtons onClear={handleClearClick} />
            <div className={styles.clearfix}></div>
          </>
        </GridFilterModal>
      )}
    </div>
  );
};

export default GridFilter;
