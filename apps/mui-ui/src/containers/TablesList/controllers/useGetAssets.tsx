import { useEffect, useState } from 'react';
import {
  DataSource,
  Asset,
  Aggregation,
  ColumnSortDirection,
} from 'types/entities.types';
import { GET_ASSETS_LIST } from './query';
import { Pagination } from 'components/Grid/Grid';
import { Error } from '../../../types/utils.types';
import { useLazyQuery } from '@apollo/client';
import { useGetAggregations } from './useGetAggregations';
import { Filter } from '../../../components/Grid/types';
import { useApolloErrorHandler } from '../../../sideEffects/api/useApolloErrorHandler';

interface Props {
  dataSource?: DataSource;
  currentPagination: Pagination;
  selectedFilters: Filter[];
  sortedColumns: ColumnSortDirection[];
}

interface AssetsLoaded {
  loading: boolean;
  error: Error | undefined;
  assets: Asset[];
  assetsRowCount: number;
  aggregations: Aggregation[];
}

const getFiltersString = (selectedFilters: Filter[]): string => {
  const filters = selectedFilters.reduce<string>((acc, filter) => {
    if (filter.selectedValue !== undefined && !filter.customQuery) {
      const value =
        (filter.type === 'aggregation' || filter.type === 'options') &&
        filter.selectedValue &&
        typeof filter.selectedValue !== 'string'
          ? filter.selectedValue?.value
          : filter.selectedValue?.toString().trim();

      const remoteFieldsString = filter.remoteSearchFields.reduce<string>(
        (acc, remoteSearchField) => `${acc}, ${remoteSearchField}: "${value}"`,
        ''
      );
      return `${acc}${remoteFieldsString}`;
    } else {
      return '';
    }
  }, '');

  return `${filters} ${getCustomFiltersString(selectedFilters)}`;
};

const getCustomFiltersString = (selectedFilters: Filter[]): string => {
  const customFilters = selectedFilters.reduce<string>((acc, filter) => {
    if (
      filter.selectedValue !== undefined &&
      filter.selectedValue !== '' &&
      filter.customQuery &&
      filter.customQuery.operator &&
      filter.customQuery.key
    ) {
      const value =
        (filter.type === 'aggregation' || filter.type === 'options') &&
        filter.selectedValue &&
        typeof filter.selectedValue !== 'string'
          ? filter.selectedValue?.value
          : filter.selectedValue?.toString().trim();

      return `${acc}{operator: ${filter.customQuery.operator}, key: "${filter.customQuery.key}", value: "${value}"},`;
    } else {
      return '';
    }
  }, '');

  return customFilters ? `filters: [${customFilters}]` : '';
};

const getSortedColumnsString = (
  sortedColumns: ColumnSortDirection[]
): string => {
  if (sortedColumns.length > 0) {
    return `sortBy: ${
      sortedColumns[0].columnName
    }, sortType: ${sortedColumns[0].sortDirection.toLowerCase()}`;
  } else {
    return '';
  }
};

export const useGetAssets = ({
  dataSource,
  currentPagination,
  selectedFilters,
  sortedColumns,
}: Props): AssetsLoaded => {
  const { apolloErrorHandler } = useApolloErrorHandler();
  const [dataSourceName, setDataSourceName] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsRowCount, setAssetsRowCount] = useState(0);

  const [queryAssets, { data, loading: loadingAssets, error }] = useLazyQuery(
    GET_ASSETS_LIST(
      dataSourceName,
      currentPagination.limit,
      currentPagination.offset,
      getFiltersString(selectedFilters),
      getSortedColumnsString(sortedColumns)
    ),
    {
      fetchPolicy: 'no-cache',
    }
  );

  const { aggregations, loading: loadingAggregations } =
    useGetAggregations(dataSourceName);

  useEffect(() => {
    if (dataSource) {
      setDataSourceName(dataSource.name);
    }
  }, [dataSource]);

  useEffect(() => {
    if (dataSourceName) {
      queryAssets().then(response => {
        if (response?.data?.getAssets) {
          updateAssetsResult(
            response.data.getAssets.assets,
            response.data.getAssets.row_count
          );
        }
      });
    }
  }, [dataSourceName]);

  useEffect(() => {
    if (data) {
      updateAssetsResult(data.getAssets.assets, data.getAssets.row_count);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      apolloErrorHandler(error);
    }
  }, [error]);

  const updateAssetsResult = (assets: Asset[], rowCount: number): void => {
    setAssets(assets);
    setAssetsRowCount(rowCount);
  };

  return {
    loading: loadingAssets || loadingAggregations || data === undefined,
    error: error && {
      title: 'Error loading assets',
      message: error?.message ?? '',
    },
    assets,
    assetsRowCount,
    aggregations,
  };
};
