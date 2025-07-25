import { FC } from 'react';
import { SortDirection, GridColumnHeader } from '../types';
import SortIcon from './../images/sort_by_icon.svg';
import SortIconAsc from './../images/sort_by_icon_asc.svg';
import SortIconDesc from './../images/sort_by_icon_desc.svg';
import { CSSSizeValue } from 'types/utils.types';
import styles from './../Grid.module.scss';
import { GridHeaderFilterForm } from './GridHeaderFilterForm';

interface Props {
  headers: GridColumnHeader[];
  onSortColumn?: (header: GridColumnHeader) => void;
  stickyFromTop?: CSSSizeValue;
  autoFilters?: boolean;
  collapsibleRows?: boolean;
  noBorderLine?: boolean;
}

export const getNextSortDirection = (
  header: GridColumnHeader
): SortDirection => {
  if (header.sortDirection === SortDirection.ASC) {
    return SortDirection.DESC;
  } else if (header.sortDirection === SortDirection.DESC) {
    return SortDirection.NONE;
  } else {
    return SortDirection.ASC;
  }
};

const GridHeader: FC<Props> = ({
  headers,
  onSortColumn,
  stickyFromTop,
  autoFilters = false,
  collapsibleRows = false,
  noBorderLine = false,
}) => {
  const getSortIcon = (sortDirection?: SortDirection): string => {
    if (sortDirection === SortDirection.ASC) {
      return SortIconDesc;
    } else if (sortDirection === SortDirection.DESC) {
      return SortIconAsc;
    } else {
      return SortIcon;
    }
  };

  const handleSortClick = (header: GridColumnHeader): void => {
    if (onSortColumn && header.sortable) {
      onSortColumn({
        ...header,
        sortDirection: getNextSortDirection(header),
      });
    }
  };

  if (!headers || headers.length === 0) {
    return null;
  }
  return (
    <thead
      className={stickyFromTop !== undefined ? 'defaultSticky' : undefined}
      style={{ top: stickyFromTop }}
    >
      <tr>
        {collapsibleRows && <th className={styles.collapsibleHeader}></th>}
        {headers.map(header => (
          <th
            key={header.name}
            className={header.className}
            onClick={() => handleSortClick(header)}
            style={{ width: header.width ?? undefined }}
          >
            <div
              className={`${styles.headerTitle} ${
                header.sortable ? styles.sortable : ''
              }`}
            >
              <span>{header.label}</span>
              {header.sortable && (
                <div className={styles.sortIcon}>
                  <img src={getSortIcon(header.sortDirection)} alt="Sort by" />
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
      {autoFilters && (
        <tr className={styles.filtersHeaderRow}>
          <GridHeaderFilterForm headers={headers} />
        </tr>
      )}
      <tr
        className={
          autoFilters
            ? ''
            : noBorderLine
            ? styles.NoBorderTrNoFilters
            : styles.trNoFilters
        }
      >
        <th
          colSpan={headers.length + 1}
          className={noBorderLine ? styles.noBorderLine : styles.borderLine}
        ></th>
      </tr>
    </thead>
  );
};

export default GridHeader;
