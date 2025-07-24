import { FC } from 'react';
import { useGetParams } from './hooks/useGetParams';
import Lineages from '../../components/Lineages/Lineages';
import { Loader } from '../../components/Loader';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from './../TableDetails/TableDetails.module.scss';

const LineagePage: FC = () => {
  const { asset, dataSource, loading } = useGetParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader text="Loading Lineage" />;
  }

  return (
    <>
      <div
        className={styles.tableDetails}
        style={{
          display: 'flex',
          justifyContent: 'right',
          marginTop: '1rem',
          paddingRight: '1.5rem',
          width: '100%',
        }}
      >
        <ToggleButtonGroup
          color="secondary"
          exclusive
          aria-label="metadata-lineage-selection"
          size="small"
          className={styles.metadataLineageSelector}
        >
          <ToggleButton
            value="lineage"
            aria-label="lineage"
            className={styles.toggleButton}
            onClick={goBack}
          >
            Go back
          </ToggleButton>
          <Tooltip title="New Lineage Design">
            <Link
              to={`/lineage/${dataSource}/${asset?.id}`}
              style={{ textDecoration: 'none' }}
            >
              <ToggleButton
                value="newLineage"
                aria-label="New lineage design"
                className={styles.toggleButtonSelected}
              >
                Lineage *
              </ToggleButton>
            </Link>
          </Tooltip>
        </ToggleButtonGroup>
      </div>
      {dataSource && asset && (
        <Lineages
          assetId={asset.id}
          lineageAssetName={asset.name}
          dataSource={dataSource}
          useNewDesign
        />
      )}
    </>
  );
};

export default LineagePage;
