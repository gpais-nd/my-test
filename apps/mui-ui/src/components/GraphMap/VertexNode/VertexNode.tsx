import { FC, useState } from 'react';
import { Geometry, Vertex } from '../GraphMap.types';
import styles from './../GraphMap.module.scss';
import { VERTEX_DETAILS_HEIGHT } from '../GraphMap.functions';
import ToggleSubnodesButton from './ToggleSubnodesButton/ToggleSubnodesButton';
import SVGObject from '../SVGObject/SVGObject';
import { ReactComponent as DownloadIcon } from '../VertexNodeGroup/icons/downloadIcon.svg';
import { Button } from 'components/Button';

interface Props {
  vertex: Vertex;
  showChildrenButton?: boolean;
  showParentsButton?: boolean;
  hideChildrenTooltip?: string;
  showChildrenTooltip?: string;
  hideParentsTooltip?: string;
  showParentsTooltip?: string;
  displayAsSVGObject?: boolean;
  showAsSingleNode?: boolean;
  onOpenChildren?: (vertex: Vertex) => Promise<boolean>;
  onCloseChildren?: (vertex: Vertex) => Promise<boolean>;
  onOpenParents?: (vertex: Vertex) => Promise<boolean>;
  onCloseParents?: (vertex: Vertex) => Promise<boolean>;
  onDownloadButtonClick: (assetId: string) => void;
}

const VertexNode: FC<Props> = ({
  vertex,
  showChildrenButton = true,
  showParentsButton = true,
  displayAsSVGObject = true,
  showAsSingleNode = false,
  onOpenChildren,
  onCloseChildren,
  onOpenParents,
  onCloseParents,
  onDownloadButtonClick,
}) => {
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [childrenOpen, setChildrenOpen] = useState(vertex.areChildrenOpen);
  const [parentsOpen, setParentsOpen] = useState(vertex.areParentsOpen);
  const vertexTitleHeight = vertex.geometry.dimensions.height;
  const vertexHeight = vertex.showDetails
    ? vertexTitleHeight +
      (vertex.showDetails && vertex.showDetails === true
        ? VERTEX_DETAILS_HEIGHT
        : 0)
    : vertexTitleHeight;

  const geometry: Geometry = {
    position: {
      x: vertex.geometry.position.x,
      y: vertex.geometry.position.y,
    },
    dimensions: {
      height: vertexHeight,
      width: vertex.geometry.dimensions.width ?? 0,
    },
  };

  const handleClickChildrenButton = async (): Promise<void> => {
    setIsLoadingChildren(true);
    if (!childrenOpen && onOpenChildren) {
      await onOpenChildren(vertex);
    } else if (onCloseChildren) {
      await onCloseChildren(vertex);
    }
    setIsLoadingChildren(false);
    setChildrenOpen(!childrenOpen);
  };

  const handleClickParentsButton = async (): Promise<void> => {
    setIsLoadingParents(true);
    if (!parentsOpen && onOpenParents) {
      await onOpenParents(vertex);
    } else if (onCloseParents) {
      await onCloseParents(vertex);
    }
    setIsLoadingParents(false);
    setParentsOpen(!parentsOpen);
  };

  const vertexNodeContent = (
    <div style={{ display: 'block' }}>
      {onDownloadButtonClick && (
        <Button
          className={styles.downloadButton}
          onClick={() => onDownloadButtonClick(vertex.id)}
          children={<DownloadIcon />}
        />
      )}
      <div
        className={`${styles.vertexContainer} ${
          showAsSingleNode ? styles.vertexContainerSingle : ''
        }`}
      >
        <div
          className={`${styles.vertex} 
        ${vertex?.isRoot ? styles.rootVertex : ''} 
        ${
          showAsSingleNode
            ? styles.vertexSingleNode
            : !displayAsSVGObject
            ? styles.vertexGrouped
            : ''
        }`}
          style={{
            height: vertex.showDetails ? vertexTitleHeight : '100%',
          }}
        >
          {showParentsButton && !(vertex.hideToggleButton === true) && (
            <ToggleSubnodesButton
              isOpen={parentsOpen!}
              isLoading={isLoadingParents}
              floatSide="left"
              onClick={handleClickParentsButton}
              className={styles[vertex.type]}
              classNameSelected={styles[`${vertex.type}_selected`]}
              classNameLoader={styles[`${vertex.type}_loader`]}
            />
          )}
          <div className={styles.content}>{vertex.content}</div>
          {showChildrenButton && !(vertex.hideToggleButton === true) && (
            <ToggleSubnodesButton
              isOpen={childrenOpen!}
              isLoading={isLoadingChildren}
              floatSide="right"
              onClick={handleClickChildrenButton}
              className={styles[vertex.type]}
              classNameSelected={styles[`${vertex.type}_selected`]}
              classNameLoader={styles[`${vertex.type}_loader`]}
            />
          )}
        </div>
        {vertex.showDetails &&
          vertex.showDetails === true &&
          vertex.details && (
            <div
              className={`${styles.vertexDetails}`}
              style={{ height: VERTEX_DETAILS_HEIGHT }}
            >
              {vertex.details.map(detail => (
                <div key={detail.name}>
                  <span className={styles.detailsName}>{detail.name}</span>
                  {': '}
                  <span className={styles.detailsValue}>{detail.value}</span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );

  return displayAsSVGObject ? (
    <SVGObject geometry={geometry}>{vertexNodeContent}</SVGObject>
  ) : (
    vertexNodeContent
  );
};

export default VertexNode;
