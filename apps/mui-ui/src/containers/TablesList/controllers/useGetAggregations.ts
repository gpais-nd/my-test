import { useEffect, useState } from 'react';
import { Aggregation } from 'types/entities.types';
import { GET_AGGREGATIONS } from './query';
import { APIAggregations } from 'types/api.types';
import { QueryResult, useLazyQuery } from '@apollo/client';
import { Error } from '../../../types/utils.types';

interface AggregationsLoaded {
  loading: boolean;
  error: Error | undefined;
  aggregations: Aggregation[];
}

export const useGetAggregations = (
  dataSourceName: string
): AggregationsLoaded => {
  const [aggregations, setAggregations] = useState<Aggregation[]>([]);

  const [queryAggregations, { loading, error }] = useLazyQuery(
    GET_AGGREGATIONS(dataSourceName),
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    const promises = [];
    if (dataSourceName) {
      promises.push(queryAggregations());
    }

    Promise.allSettled(promises).then(results => {
      setAggregations(parseAggregationsPromiseResults(results));
    });
  }, [dataSourceName]);

  const parseAggregationsPromiseResults = (
    promiseResults: PromiseSettledResult<QueryResult>[]
  ): Aggregation[] =>
    promiseResults.reduce<Aggregation[]>((acc, promiseResult) => {
      if (promiseResult.status === 'fulfilled') {
        const data = promiseResult.value?.data;

        if (data?.getAggregations) {
          const aggregations = apiAggregationsToAggregations(
            data.getAggregations
          );
          return [...acc, ...aggregations];
        } else if (data?.getAggregationsOMSBuckets) {
          const aggregations = apiAggregationsToAggregations(
            data.getAggregationsOMSBuckets
          );
          return [...acc, ...aggregations];
        } else {
          return [...acc];
        }
      } else {
        return [...acc];
      }
    }, []);

  const apiAggregationsToAggregations = (
    apiAggregations: APIAggregations
  ): Aggregation[] =>
    Object.entries(apiAggregations).reduce<Aggregation[]>(
      (acc, [key, aggregation]) => {
        return aggregation && typeof aggregation !== 'string'
          ? [
              ...acc,
              {
                name: key,
                options: aggregation.buckets
                  ? aggregation.buckets.map(bucket => ({
                      value: bucket.key,
                      label: bucket.key,
                      count: parseInt(bucket.doc_count),
                    }))
                  : [],
              },
            ]
          : [...acc];
      },
      []
    );

  return {
    loading: loading,
    error: error && {
      title: 'Error loading aggregations',
      message: error?.message ?? '',
    },
    aggregations,
  };
};
