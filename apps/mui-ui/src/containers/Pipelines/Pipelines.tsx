import { FC, ReactElement, useEffect, useState } from 'react';
import { Grid } from '../../components/Grid';
import { GridColumnHeader } from '../../components/Grid/types';
import DialogWindow from '../../components/DialogWindow';
import { Lineage } from '../../types/entities.types';
import { useGetPipelineLineages } from './controllers/useGetPipelineLineages';
import { Pagination } from '../../components/Grid/Grid';
import styles from './Pipelines.module.scss';
import { LineageFlow } from 'components/Lineages/LineageFlow';
import { LegendPipeline } from 'components/Lineages/LineageViewer/LineageLegends';
import { QueryTypeEnum } from 'utils/lineage.utils';

const headers: GridColumnHeader[] = [
  {
    name: 'pipelineName',
    label: 'Pipeline',
    width: '100%',
  },
];

interface PipelineRow {
  id: string;
  pipelineName: string | ReactElement;
}

const Pipelines: FC = () => {
  const { lineages, loading } = useGetPipelineLineages();
  const [lineageRows, setLineageRows] = useState<PipelineRow[]>([]);
  const [currentLineage, setCurrentLineage] = useState<Lineage>();

  useEffect(() => {
    setLineageRows(
      lineages
        .sort((a, b) => (a.src.name < b.src.name ? -1 : 1))
        .map(lineage => ({
          id: `${lineage.src.id}_${lineage.dest.id}`,
          pipelineName: (
            <div
              className={styles.pipeline}
              onClick={() => handlePipelineClick(lineage.src.id)}
            >
              {lineage.src.name}
            </div>
          ),
        }))
    );
  }, [lineages]);

  const handlePipelineClick = (lineageId: string): void => {
    const lineage = lineages.find(l => l.src.id === lineageId);
    if (lineage) {
      setCurrentLineage(lineage);
    }
  };

  const handleModalClose = (): void => {
    setCurrentLineage(undefined);
  };

  return (
    <div className={styles.pipelines}>
      <Grid
        headers={headers}
        data={lineageRows}
        stickyFromTop={'0rem'}
        isLoading={loading}
        currentPagination={{ limit: 100 } as Pagination}
      />

      {currentLineage && (
        <DialogWindow
          title="Pipeline Lineage"
          isOpen={currentLineage !== undefined}
          modalClose={handleModalClose}
        >
          <LineageFlow
            title=""
            dataSource={currentLineage.src.dataSource}
            assetId={currentLineage.src.id}
            assetName={currentLineage.src.name}
            legend={LegendPipeline()}
            queryType={QueryTypeEnum.PIPELINE}
            useNewDesign={true}
          />
        </DialogWindow>
      )}
    </div>
  );
};

export default Pipelines;
