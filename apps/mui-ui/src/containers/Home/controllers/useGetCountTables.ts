import { useEffect, useState } from 'react';
import { DataSource } from 'types/entities.types';
import { GET_TABLES_COUNT } from './query';
import { APITablesCountResponse } from 'types/api.types';
import { useQuery } from '@apollo/client';
import { Error } from '../../../types/utils.types';
import { useApolloErrorHandler } from '../../../sideEffects/api/useApolloErrorHandler';

interface AggregationsLoaded {
  loading: boolean;
  error: Error | undefined;
  tablesCounting: TablesCounting;
}

interface TablesCounting {
  [key: string]: number;
}

export const useGetCountTables = (
  dataSources: DataSource[]
): AggregationsLoaded => {
  const { apolloErrorHandler } = useApolloErrorHandler();
  const [tablesCounting, setTablesCounting] = useState<TablesCounting>({});

  const { error, loading, data } = useQuery(GET_TABLES_COUNT(dataSources), {
    skip: dataSources.length === 0,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data) {
      setTablesCounting(apiTablesCountToTablesCounting(data));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      apolloErrorHandler(error);
    }
  }, [error]);

  const apiTablesCountToTablesCounting = (
    apiTablesCount: APITablesCountResponse
  ): TablesCounting => {
    return Object.entries(apiTablesCount).reduce<TablesCounting>(
      (acc, [key, counting]) => {
        return {
          ...acc,
          [key]: parseInt(counting.row_count),
        };
      },
      {}
    );
  };

  return {
    loading,
    error: error && {
      code: 'GraphQL error',
      message: error?.message ?? '',
    },
    tablesCounting,
  };
};
