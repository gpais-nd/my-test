import React, { FC, useState } from 'react';
import { DataSource } from '../../types/entities.types';
import { Box, Tab, Tabs } from '@mui/material';
import styles from './Lineages.module.scss';
import { LineageFlow } from './LineageFlow';
import { ReactFlowProvider } from '@xyflow/react';
import { QueryTypeEnum } from 'utils/lineage.utils';
import {
  LegendCloned,
  LegendCw,
  LegendJobs,
  LegendPipeline,
  LegendQuery,
  LegendTable,
} from './LineageViewer/LineageLegends';

interface Props {
  assetId: string;
  lineageAssetName: string;
  dataSource: DataSource;
  useNewDesign?: boolean;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
const Lineages: FC<Props> = ({
  assetId,
  lineageAssetName,
  dataSource,
  useNewDesign = false,
}) => {
  const [lineageActiveTab, setLineageActiveTab] = useState(0);
  const [jobsLineageExists, setJobsLineageExists] = useState(false);
  const [jobAssetId, setJobAssetId] = useState<string>();
  const [jobAssetName, setJobAssetName] = useState<string>();
  const [jobDataSourceName, setDataSourceName] = useState<string>();
  const handleChangeLineageActiveTab = (
    event: React.SyntheticEvent,
    selectedLineageTab: number
  ) => {
    setLineageActiveTab(selectedLineageTab);
  };
  const handleJobsLineageVertexClick = (
    clickedJobAssetId: string,
    clickedAssetName: string,
    clickedDataSourceName: string
  ): void => {
    setJobAssetId(clickedJobAssetId);
    setJobAssetName(clickedAssetName);
    setDataSourceName(clickedDataSourceName);
    setLineageActiveTab(4);
  };
  const handleJobsLineageExists = (
    clickedJobAssetId: string,
    clickedAssetName: string,
    clickedDataSourceName: string
  ) => {
    setJobAssetId(clickedJobAssetId);
    setJobAssetName(clickedAssetName);
    setDataSourceName(clickedDataSourceName);
    setJobsLineageExists(true);
  };
  return (
    <>
      {dataSource.showLineage === true && (
        <div className={styles.lineageContainer}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={lineageActiveTab}
                onChange={handleChangeLineageActiveTab}
                aria-label="basic tabs example"
                classes={{ indicator: styles.tabIndicator }}
              >
                {dataSource?.showLineageTable === false ? null : (
                  <Tab
                    label="Table Lineage"
                    className={
                      lineageActiveTab === 0 ? styles.tabSelected : styles.tab
                    }
                  />
                )}
                {dataSource?.showLineageQuery === false ? null : (
                  <Tab
                    label="Query Lineage"
                    className={
                      lineageActiveTab === 1 ? styles.tabSelected : styles.tab
                    }
                  />
                )}
                {dataSource?.showLineageCloned === false ? null : (
                  <Tab
                    label="Cloned Lineage"
                    onClick={() => setLineageActiveTab(2)}
                    className={
                      lineageActiveTab === 2 ? styles.tabSelected : styles.tab
                    }
                  />
                )}
                {dataSource?.showLineageCW === false ? null : (
                  <Tab
                    label="CW Lineage"
                    className={
                      lineageActiveTab === 3 ? styles.tabSelected : styles.tab
                    }
                  />
                )}
                {jobsLineageExists && (
                  <Tab
                    label="Job Lineage"
                    className={
                      lineageActiveTab === 4 ? styles.tabSelected : styles.tab
                    }
                  />
                )}
                {dataSource?.showLineagePipeline === false ? null : (
                  <Tab
                    label="Pipeline Lineage"
                    className={
                      lineageActiveTab === 5 ? styles.tabSelected : styles.tab
                    }
                  />
                )}
              </Tabs>
            </Box>
            <ReactFlowProvider>
              <CustomTabPanel value={lineageActiveTab} index={0}>
                <LineageFlow
                  title=""
                  dataSource={dataSource.name || ''}
                  assetId={assetId}
                  assetName={lineageAssetName}
                  queryType={QueryTypeEnum.TABLE}
                  legend={useNewDesign ? undefined : LegendTable()}
                  onLoadedJobs={handleJobsLineageExists}
                  onVertexClick={handleJobsLineageVertexClick}
                  useNewDesign={useNewDesign}
                />
              </CustomTabPanel>
              <CustomTabPanel value={lineageActiveTab} index={1}>
                <LineageFlow
                  title=""
                  dataSource={dataSource.name || ''}
                  assetId={assetId}
                  assetName={lineageAssetName}
                  queryType={QueryTypeEnum.QUERY}
                  legend={useNewDesign ? undefined : LegendQuery()}
                  useNewDesign={useNewDesign}
                />
              </CustomTabPanel>
              <CustomTabPanel value={lineageActiveTab} index={2}>
                <LineageFlow
                  title=""
                  dataSource={dataSource.name || ''}
                  assetId={assetId}
                  assetName={lineageAssetName}
                  queryType={QueryTypeEnum.CLONED}
                  legend={useNewDesign ? undefined : LegendCloned()}
                  useNewDesign={useNewDesign}
                />
              </CustomTabPanel>
              <CustomTabPanel value={lineageActiveTab} index={3}>
                <LineageFlow
                  title=""
                  dataSource={dataSource.name || ''}
                  assetId={assetId}
                  assetName={lineageAssetName}
                  queryType={QueryTypeEnum.CW}
                  legend={useNewDesign ? undefined : LegendCw()}
                  useNewDesign={useNewDesign}
                />
              </CustomTabPanel>
              <CustomTabPanel value={lineageActiveTab} index={4}>
                {jobAssetId && jobAssetName && jobDataSourceName && (
                  <LineageFlow
                    title=""
                    dataSource={dataSource.name || ''}
                    assetId={assetId}
                    assetName={lineageAssetName}
                    queryType={QueryTypeEnum.JOB}
                    legend={useNewDesign ? undefined : LegendJobs()}
                    useNewDesign={useNewDesign}
                  />
                )}
              </CustomTabPanel>
              <CustomTabPanel value={lineageActiveTab} index={5}>
                <LineageFlow
                  title=""
                  dataSource={dataSource.name || ''}
                  assetId={assetId}
                  assetName={lineageAssetName}
                  queryType={QueryTypeEnum.PIPELINE}
                  legend={useNewDesign ? undefined : LegendPipeline()}
                  useNewDesign={useNewDesign}
                />
              </CustomTabPanel>
            </ReactFlowProvider>
          </Box>
        </div>
      )}
    </>
  );
};

export default Lineages;
