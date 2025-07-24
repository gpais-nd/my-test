import { FC } from 'react';
import Pagination from 'react-js-pagination';
import FirstPageIcon from './images/FirstPageIcon';
import PrevPageIcon from './images/PrevPageIcon';
import NextPageIcon from './images/NextPageIcon';
import LastPageIcon from './images/LastPageIcon';
import styles from './GridPaginator.module.scss';
import { GridPaginatorResults } from './GridPaginatorResults';

interface Props {
  activePage: number;
  rowsPerPage: number;
  totalItemsCount: number;
  rowsFrom: number;
  rowsTo: number;
  pageRangeDisplayed?: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const GridPaginator: FC<Props> = ({
  activePage,
  rowsPerPage,
  totalItemsCount,
  rowsFrom,
  rowsTo,
  pageRangeDisplayed = 5,
  onPageChange,
  onRowsPerPageChange,
}) => (
  <div className={styles.tablePaginator}>
    <div className={styles.paginator}>
      <Pagination
        activePage={activePage}
        itemsCountPerPage={rowsPerPage}
        totalItemsCount={parseInt(totalItemsCount.toString())}
        pageRangeDisplayed={pageRangeDisplayed}
        firstPageText={<FirstPageIcon />}
        prevPageText={<PrevPageIcon />}
        nextPageText={<NextPageIcon />}
        lastPageText={<LastPageIcon />}
        disabledClass={styles.disabled}
        activeClass={styles.active}
        onChange={onPageChange}
      />
    </div>
    <GridPaginatorResults
      from={rowsFrom}
      to={rowsTo}
      totalItemsCount={totalItemsCount}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={onRowsPerPageChange}
    />
  </div>
);

export default GridPaginator;
