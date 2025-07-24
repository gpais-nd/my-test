import { FC, useEffect, useMemo, useState } from 'react';
import { Grid } from 'components/Grid';
import {
  Aggregation,
  Asset,
  AssetRowEntry,
  DataSource,
  ColumnSortDirection,
} from 'types/entities.types';
import { useNavigate, useParams } from 'react-router-dom';
import { LinkTabs } from 'components/LinkTabs';
import { LinkTab } from 'components/LinkTabs/LinkTabs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../sideEffects/reducers';
import {
  fetchDataSources,
  saveListFilters,
  saveListSortedColumns,
} from '../../sideEffects/actions/app.actions';
import { Pagination } from 'components/Grid/Grid';
import styles from './TablesList.module.scss';
import { dataSourcesParameters } from 'utils/datasources.utils';
import { useGetAssets } from './controllers/useGetAssets';
import {
  Filter,
  GridColumnHeader,
  SortDirection,
} from '../../components/Grid/types';
import { AssetRowValueElement } from '../../components/Asset/AssetRow';
import { clearToastMessages } from '../../sideEffects/actions/gui.actions';

const MAX_RECORDS_IN_PAGINATION = 10000;
const DEFAULT_LIMIT_PAGINATION = 100;

const getAssetRow = (
  asset: Asset,
  headers: GridColumnHeader[]
): AssetRowEntry =>
  headers.reduce(
    (acc, header) => ({
      ...acc,
      [header.name]: (
        <AssetRowValueElement asset={asset} fieldName={header.name} />
      ),
    }),
    { id: asset.businessMetadata.asset_id }
  );

const getAssetRows = (
  assets: Asset[],
  headers?: GridColumnHeader[]
): AssetRowEntry[] =>
  headers
    ? assets.reduce<AssetRowEntry[]>(
        (acc, asset) => [...acc, getAssetRow(asset, headers)],
        []
      )
    : [];

const TablesList: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataSource: dataSourceName } = useParams();
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagination, setCurrentPagination] = useState<Pagination>({
    limit: DEFAULT_LIMIT_PAGINATION,
    offset: 0,
  });
  const [headers, setHeaders] = useState<GridColumnHeader[]>([]);
  const searchFilter: Filter = {
    type: 'text',
    headerName: 'freeTextSearch',
    remoteSearchFields: ['freeTextSearch'],
  };

  const dataSources = useSelector((state: RootState) => state.app.dataSources);
  const gridPageStatus = useSelector(
    (state: RootState) => state.app.gridPageStatus
  );

  const { assets, assetsRowCount, aggregations, error, loading } = useGetAssets(
    {
      dataSource: selectedDataSource,
      currentPagination,
      selectedFilters: gridPageStatus.filters,
      sortedColumns: gridPageStatus.sortedColumns,
    }
  );

  const assetRows = useMemo(() => {
    return getAssetRows(assets, selectedDataSource?.gridHeaders ?? []);
  }, [assets, selectedDataSource]);

  useEffect(() => {
    dispatch(clearToastMessages());
  }, []);

  useEffect(() => {
    if (dataSources.length === 0) {
      dispatch(fetchDataSources());
    }
  }, [dataSources]);

  useEffect(() => {
    const dataSourceFound = dataSourcesParameters.find(
      dataSource => dataSource.name === dataSourceName
    );
    if (dataSourceFound) {
      setSelectedDataSource(
        dataSourcesParameters.find(
          dataSource => dataSource.name === dataSourceName
        )
      );
      setCurrentPage(1);

      const fixedFilters = dataSourceFound.gridHeaders?.reduce<Filter[]>(
        (acc, header) => {
          if (header.filter?.type === 'fixed') {
            return [...acc, header.filter];
          } else {
            return [...acc];
          }
        },
        []
      );

      if (fixedFilters) {
        updateStoredFilters(fixedFilters);
      } else if (gridPageStatus.dataSourceName !== dataSourceName) {
        updateStoredFilters([]);
      }
    } else {
      navigate('/');
    }
  }, [dataSourceName]);

  useEffect(() => {
    if (selectedDataSource && selectedDataSource.gridHeaders) {
      updateStoredSortedColumns(
        selectedDataSource.gridHeaders.reduce<ColumnSortDirection[]>(
          (acc, header) => {
            if (
              header.defaultSortBy !== undefined &&
              header.defaultSortType !== undefined
            ) {
              return [
                ...acc,
                {
                  columnName: header.defaultSortBy,
                  sortDirection: header.defaultSortType,
                },
              ];
            } else {
              return [...acc];
            }
          },
          []
        )
      );

      setHeaders(
        updateHeaderFiltersWithAggregations(
          selectedDataSource.gridHeaders,
          aggregations
        )
      );
    }
  }, [selectedDataSource, aggregations]);

  useEffect(() => {
    resetPagination();
  }, [gridPageStatus]);

  const updateHeaderFiltersWithAggregations = (
    headers: GridColumnHeader[],
    aggregations: Aggregation[]
  ): GridColumnHeader[] =>
    headers.map(header => {
      if (header.filter) {
        if (header.filter.type === 'aggregation') {
          return {
            ...header,
            filter: {
              ...header.filter,
              headerName: header.name,
              options:
                aggregations.find(
                  aggregation =>
                    aggregation.name === header?.filter?.aggregationName
                )?.options ?? [],
            },
          };
        } else {
          return {
            ...header,
            filter: {
              ...header.filter,
              headerName: header.name,
            },
          };
        }
      } else {
        return { ...header };
      }
    });

  const updateStoredFilters = (filters: Filter[]): void => {
    dispatch(saveListFilters(dataSourceName as string, filters));
  };

  const updateStoredSortedColumns = (
    sortDirections: ColumnSortDirection[]
  ): void => {
    dispatch(saveListSortedColumns(sortDirections));
  };

  const onChangePagination = (
    pagination: Pagination,
    currentPage: number
  ): void => {
    if (
      currentPagination.limit !== pagination.limit ||
      currentPagination.offset !== pagination.offset
    ) {
      if (pagination.offset + pagination.limit > MAX_RECORDS_IN_PAGINATION) {
        setCurrentPagination({
          limit: pagination.limit,
          offset: MAX_RECORDS_IN_PAGINATION - pagination.limit,
        });
        setCurrentPage(
          Math.floor(
            (MAX_RECORDS_IN_PAGINATION - pagination.limit) / pagination.limit
          )
        );
      } else {
        setCurrentPagination({ ...pagination });
        setCurrentPage(currentPage);
      }
    }
  };

  const resetPagination = () => {
    setCurrentPagination({
      limit: DEFAULT_LIMIT_PAGINATION,
      offset: 0,
    });
    setCurrentPage(1);
  };

  const handleChangeFilter = (filter: Filter): void => {
    const exists = gridPageStatus.filters.find(
      f => f.headerName === filter.headerName
    );

    if (filter.selectedValue && exists) {
      updateStoredFilters(
        gridPageStatus.filters
          .map(f =>
            f.headerName === filter.headerName ? { ...filter } : { ...f }
          )
          .reduce<Filter[]>(
            (acc, f) => (f.selectedValue ? [...acc, f] : [...acc]),
            []
          )
      );
    } else if (filter.selectedValue && !exists) {
      updateStoredFilters([...gridPageStatus.filters, { ...filter }]);
    } else {
      updateStoredFilters(
        gridPageStatus.filters.filter(f => f.headerName !== filter.headerName)
      );
    }
  };

  const handleClearFilters = (): void => {
    updateStoredFilters([]);
  };

  const handleSortColumnHeader = (header: GridColumnHeader): void => {
    setHeaders(
      headers.map(h =>
        h.name === header.name
          ? { ...header }
          : { ...h, sortDirection: SortDirection.NONE }
      )
    );

    if (header.remoteSortField && header.sortDirection !== SortDirection.NONE) {
      updateStoredSortedColumns([
        {
          columnName: header.remoteSortField,
          sortDirection: header.sortDirection ?? SortDirection.NONE,
        },
      ]);
    } else {
      updateStoredSortedColumns([]);
    }
  };

  const linkTabs: LinkTab[] = dataSources
    .filter(dataSource => dataSource.isEnabled)
    .map<LinkTab>(dataSource => ({
      name: dataSource.name,
      label: dataSource.dataSourceLabel || dataSource.name,
      url: `/dataSource/${dataSource.name}`,
      isSelected: dataSource.name === selectedDataSource?.name,
    }));

  return (
    <>
      <LinkTabs
        linkTabs={linkTabs}
        stickyFromTop={0}
        searchFilter={searchFilter}
        selectedFilters={gridPageStatus.filters}
        onChangeFilter={handleChangeFilter}
        selectedDataSource={selectedDataSource?.name}
      />
      {selectedDataSource && !error && (
        <Grid
          headers={headers}
          data={assetRows}
          className={styles.tablesList}
          stickyFromTop={'4.125rem'}
          selectedFilters={gridPageStatus.filters}
          onChangeFilter={handleChangeFilter}
          onClearFilters={handleClearFilters}
          rowCount={assetsRowCount}
          serverSideMode
          currentPage={currentPage}
          currentPagination={currentPagination}
          setServerSidePagination={onChangePagination}
          isLoading={loading}
          autoFilters
          onSortColumnHeader={handleSortColumnHeader}
        />
      )}
    </>
  );
};

export default TablesList;
