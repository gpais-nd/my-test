import { useEffect, useState } from 'react';
import { Lineage } from 'types/entities.types';
import { Error } from '../../../types/utils.types';
import { useLazyQuery } from '@apollo/client';
import { useApolloErrorHandler } from '../../../sideEffects/api/useApolloErrorHandler';
import { GET_PIPELINE_LINEAGES } from './query';
import { APILineage } from '../../../types/api.types';

interface PipelineLineagesLoaded {
  loading: boolean;
  error: Error | undefined;
  lineages: Lineage[];
  lineagesRowCount: number;
}

export const useGetPipelineLineages = (): PipelineLineagesLoaded => {
  const { apolloErrorHandler } = useApolloErrorHandler();
  const [lineages, setLineages] = useState<Lineage[]>([]);
  const [lineagesRowCount, setLineagesRowCount] = useState(0);

  const [queryPipelineLineages, { loading, error }] = useLazyQuery(
    GET_PIPELINE_LINEAGES(),
    {
      fetchPolicy: 'no-cache',
    }
  );

  useEffect(() => {
    queryPipelineLineages().then(response => {
      if (response?.data?.getPipelineLineage.lineages) {
        const apiLineages: APILineage[] =
          response.data.getPipelineLineage.lineages;

        setLineages(
          apiLineages.map(apiLineage => ({
            src: {
              id: apiLineage.src_id,
              name: apiLineage.src_name,
              type: apiLineage.src_type,
              dataSource: apiLineage.src_datasource,
              owner: apiLineage.src_owner ?? '',
              team: apiLineage.src_team ?? '',
              critical: apiLineage.src_critical ?? '',
            },
            dest: {
              id: apiLineage.dest_id,
              name: apiLineage.dest_name,
              type: apiLineage.dest_type,
              dataSource: apiLineage.dest_datasource,
            },
            relationType: apiLineage.relation_type,
          }))
        );
        setLineagesRowCount(apiLineages.length);
      }
    });
  }, []);

  useEffect(() => {
    if (error) {
      apolloErrorHandler(error);
    }
  }, [error]);

  return {
    loading,
    error: error && {
      title: 'Error loading pipeline lineages',
      message: error?.message ?? '',
    },
    lineages,
    lineagesRowCount,
  };
};
