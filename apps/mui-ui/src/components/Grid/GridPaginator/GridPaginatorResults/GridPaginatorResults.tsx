import { FC, useEffect, useState } from 'react';
import styles from './../GridPaginator.module.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface GridPaginatorResultsProps {
  from: number;
  to: number;
  totalItemsCount: number;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

const GridPaginatorResults: FC<GridPaginatorResultsProps> = ({
  from,
  to,
  totalItemsCount,
  rowsPerPage,
  setRowsPerPage,
  rowsPerPageOptions,
}) => {
  const [rowsPerPageOptionsDropdown, setRowsPerPageOptionsDropdown] = useState([
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ]);

  useEffect(() => {
    if (rowsPerPageOptions?.length) {
      setRowsPerPageOptionsDropdown(rowsPerPageOptions);
    }
  }, [rowsPerPageOptions]);

  return (
    <div className={styles.results}>
      <div className={styles.showing}>
        Showing {from} - {to} of {totalItemsCount} results
      </div>
      <div className={styles.rowsPerPage}>
        <div className={styles.rowsPerPageText}>Rows per page</div>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={rowsPerPage.toString()}
          onChange={newRowsPerPage => {
            if (newRowsPerPage.target.value) {
              setRowsPerPage(parseInt(newRowsPerPage.target.value));
            }
          }}
          className={styles.rowsPerPage}
        >
          {rowsPerPageOptionsDropdown.map(rowsPerPageOption => (
            <MenuItem
              key={rowsPerPageOption}
              value={rowsPerPageOption.toString()}
              data-testid={`dropdownRowsPerPage${rowsPerPageOption.toString()}`}
            >
              {rowsPerPageOption.toString()}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default GridPaginatorResults;
