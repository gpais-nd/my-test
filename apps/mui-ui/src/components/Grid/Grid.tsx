import { ReactElement, createContext, useEffect, useState } from 'react';
import { GridHeader } from './GridHeader';
import { GridData } from './GridData';
import { GridFooter } from './GridFooter';
import {
  SortDirection,
  GridColumnHeader,
  Filter,
  GenericGridRow,
} from './types';
import { ActionComponents } from '../ActionComponents';
import styles from './Grid.module.scss';
import { GridPaginator } from './GridPaginator';
import { CSSSizeValue } from 'types/utils.types';
import { GridFilter } from './GridFilter';
import { Loader } from 'components/Loader';

export interface Pagination {
  limit: number;
  offset: number;
}

interface Props<T extends GenericGridRow> extends React.HTMLAttributes<HTMLTableElement> {
  headers?: GridColumnHeader[];
  data: T[];
  actionComponents?: ReactElement[];
  serverSideMode?: boolean;
  rowCount?: number;
  currentPage?: number;
  currentPagination?: Pagination;
  setServerSidePagination?: (
    pagination: Pagination,
    currentPage: number
  ) => void;
  hidePagination?: boolean;
  autoFilters?: boolean;
  filterForm?: ReactElement;
  selectedFilters?: Filter[];
  onChangeFilter?: (filter: Filter) => void;
  onClearFilters?: () => void;
  stickyFromTop?: CSSSizeValue;
  isLoading?: boolean;
  className?: string;
  onSortColumnHeader?: (header: GridColumnHeader) => void;
  collapsibleRows?: boolean;
  noBorderLine?: boolean;
}

interface IGridContext {
  selectedFilters: Filter[];
  updateValueFilter: ((filter: Filter) => void) | undefined;
  clearFilters: (() => void) | undefined;
  collapsibleRows?: boolean;
}

export const GridContext = createContext<IGridContext | undefined>(undefined);

const Grid = <T extends GenericGridRow>({
  headers,
  data,
  actionComponents,
  serverSideMode = false,
  rowCount,
  currentPage,
  currentPagination,
  setServerSidePagination,
  hidePagination = false,
  autoFilters = false,
  filterForm,
  selectedFilters,
  onChangeFilter,
  onClearFilters,
  stickyFromTop,
  isLoading = false,
  className,
  onSortColumnHeader,
  collapsibleRows = false,
  noBorderLine = false,
  ...rest
}: Props<T>) => {
  const [activePage, setActivePage] = useState(
    serverSideMode && currentPage ? currentPage : 1
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    currentPagination ? currentPagination.limit : 10
  );
  const [columnHeaders, setColumnHeaders] = useState(headers ?? []);
  const [dataToDisplay, setDataToDisplay] = useState<T[]>([]);

  const totalItemsCount =
    serverSideMode && rowCount !== undefined ? rowCount : data.length;
  const rowsFrom = (activePage - 1) * rowsPerPage + 1;
  const rowsTo =
    rowsFrom + rowsPerPage - 1 > totalItemsCount
      ? totalItemsCount
      : rowsFrom + rowsPerPage - 1;

  useEffect(() => {
    if (headers) {
      setColumnHeaders([...headers]);
    }
  }, [headers]);

  useEffect(() => {
    if (serverSideMode && currentPage) {
      setActivePage(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (serverSideMode) {
      setDataToDisplay(data);
    } else {
      const sortedData: T[] = sortDataByHeaders(data, columnHeaders);
      setDataToDisplay([...sortedData.slice(rowsFrom - 1, rowsTo)]);
    }
  }, [columnHeaders, data, activePage, rowsPerPage]);

  useEffect(() => {
    if (serverSideMode && setServerSidePagination) {
      const pagination: Pagination = {
        limit: rowsPerPage,
        offset: rowsFrom - 1,
      };
      setServerSidePagination(pagination, activePage);
    }
  }, [activePage, rowsPerPage]);

  const sortDataByHeaders = (data: T[], headers: GridColumnHeader[]): T[] =>
    headers.reduce<T[]>(
      (acc, header) => {
        if (header.sortable && header.sortDirection === SortDirection.ASC) {
          return acc.sort((a, b) =>
            a[header.name as keyof T] > b[header.name as keyof T] ? 1 : -1
          );
        } else if (
          header.sortable &&
          header.sortDirection === SortDirection.DESC
        ) {
          return acc.sort((a, b) =>
            a[header.name as keyof T] > b[header.name as keyof T] ? -1 : 1
          );
        }
        return [...acc];
      },
      [...data]
    );

  const handleSortColumnHeader = (header: GridColumnHeader): void => {
    if (serverSideMode && onSortColumnHeader) {
      onSortColumnHeader(header);
    } else {
      setColumnHeaders(
        columnHeaders.map(h =>
          h.name === header.name
            ? {
                ...h,
                sortDirection: header.sortDirection,
              }
            : { ...h }
        )
      );
    }
  };

  return (
    <div className={`${styles.grid} ${className}`}>
      <GridContext.Provider
        value={{
          selectedFilters: selectedFilters ?? [],
          updateValueFilter: onChangeFilter,
          clearFilters: onClearFilters,
          collapsibleRows,
        }}
      >
        {actionComponents && (
          <ActionComponents actionComponents={actionComponents} />
        )}
        {filterForm && (
          <GridFilter stickyFromTop={'4rem'} onClearFilters={onClearFilters}>
            {filterForm}
          </GridFilter>
        )}
        {headers && (
          <div className={styles.tableContainer}>
            <table {...rest}>
              <GridHeader
                headers={columnHeaders}
                onSortColumn={handleSortColumnHeader}
                stickyFromTop={stickyFromTop}
                autoFilters={autoFilters}
                collapsibleRows={collapsibleRows}
                noBorderLine={noBorderLine}
              />
              {!isLoading && (
                <GridData<T>
                  headers={headers}
                  data={serverSideMode ? data : dataToDisplay}
                />
              )}
            </table>
          </div>
        )}
        {isLoading && <Loader text="Loading Assets" />}
        {!isLoading && !hidePagination && (
          <GridFooter>
            <GridPaginator
              activePage={activePage}
              rowsPerPage={rowsPerPage}
              totalItemsCount={totalItemsCount}
              rowsFrom={rowsFrom}
              rowsTo={rowsTo}
              onPageChange={setActivePage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </GridFooter>
        )}
      </GridContext.Provider>
    </div>
  );
};

export default Grid;
