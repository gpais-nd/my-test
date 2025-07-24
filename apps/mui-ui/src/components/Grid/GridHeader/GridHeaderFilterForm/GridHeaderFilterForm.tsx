import { FC, useContext } from 'react';
import { GridColumnHeader } from '../../types';
import { GridHeaderFilterField } from './GridHeaderFilterField';
import { IconButton } from '@mui/material';
import { GridContext } from '../../Grid';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './../../Grid.module.scss';

interface Props {
  headers: GridColumnHeader[];
}

const GridHeaderFilterForm: FC<Props> = ({ headers }) => {
  const gridContext = useContext(GridContext);
  const isClearEnabled =
    gridContext?.selectedFilters && gridContext.selectedFilters.length > 0;

  return (
    <>
      {headers.map(header => {
        if (header.filter && header.filter.type !== 'fixed') {
          return (
            <th key={header.name}>
              <div className={styles.filterWrapper}>
                <GridHeaderFilterField
                  headerName={header.name}
                  filter={header.filter}
                />
              </div>
            </th>
          );
        } else {
          return <th key={header.name}></th>;
        }
      })}
      <td className={styles.clearFiltersButton}>
        <IconButton
          color="secondary"
          aria-label="clear filters"
          title="Clear filters"
          size="small"
          className={`${isClearEnabled || styles.clearFiltersButtonDisabled}`}
          disabled={!isClearEnabled}
          onClick={gridContext?.clearFilters}
        >
          <ClearIcon />
        </IconButton>
      </td>
    </>
  );
};

export default GridHeaderFilterForm;
