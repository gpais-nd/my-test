import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import { Button } from '@mui/material';
import { toPng } from 'html-to-image';
import styles from './LineageFlow.module.scss';

function downloadImage(dataUrl: string, fileName: string) {
  const a = document.createElement('a');

  a.setAttribute('download', `${fileName}.png`);
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 4000;
const imageHeight = 4000;

export const LineageFlowDownloadButton = () => {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const allNodes = getNodes();
    const fileName = allNodes.find(node => node.type === 'rootNode');
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0
    );

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#fff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(dataUrl => downloadImage(dataUrl, fileName?.id || 'lineage'));
  };

  return (
    <Panel position="top-right">
      <Button
        variant="outlined"
        color="primary"
        style={{ background: '#fff' }}
        size="medium"
        onClick={onClick}
        className={styles.downloadLineageButton}
      >
        Download Diagram
      </Button>
    </Panel>
  );
};
