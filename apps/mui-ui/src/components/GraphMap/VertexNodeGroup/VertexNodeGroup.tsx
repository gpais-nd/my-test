import { FC, Fragment } from 'react';
import { Vertex, VerticesGroup } from '../GraphMap.types';
import VertexNode from '../VertexNode/VertexNode';
import SVGObject from '../SVGObject/SVGObject';
import GroupButton from '../GroupButton/GroupButton';
import { ReactComponent as EyeIcon } from './icons/eyeIcon.svg';
import { ReactComponent as HighlightOff } from './icons/highlightOff.svg';
import { ReactComponent as HighlightOn } from './icons/highlightOn.svg';
import styles from './VertexNodeGroup.module.scss';
import EdgeLine from '../EdgeLine/EdgeLine';
import { NodeType } from '../../../types/entities.types';

interface Props {
  verticesGroup: VerticesGroup;
  isVisible: boolean;
  showChildrenButton?: boolean;
  showParentsButton?: boolean;
  hideChildrenTooltip?: string;
  showChildrenTooltip?: string;
  hideParentsTooltip?: string;
  showParentsTooltip?: string;
  showHeader?: boolean;
  showNodesAsSingle?: boolean;
  onOpenChildren?: (vertex: Vertex) => Promise<boolean>;
  onCloseChildren?: (vertex: Vertex) => Promise<boolean>;
  onOpenParents?: (vertex: Vertex) => Promise<boolean>;
  onCloseParents?: (vertex: Vertex) => Promise<boolean>;
  onDownloadButtonClick: (assetId: string) => void;
  onViewMoreVertices?: (vertexGroup: VerticesGroup) => void;
  onViewAllVertices?: (vertexGroup: VerticesGroup) => void;
  onTogglePinGroup?: (vertexGroup: VerticesGroup) => void;
  onHighlightThree?: (vertexGroup: VerticesGroup, state: boolean) => void;
}

const VertexNodeGroup: FC<Props> = ({
  verticesGroup,
  isVisible,
  showChildrenButton = false,
  showParentsButton = false,
  hideChildrenTooltip,
  showChildrenTooltip,
  hideParentsTooltip,
  showParentsTooltip,
  showHeader = true,
  showNodesAsSingle = false,
  onOpenChildren,
  onCloseChildren,
  onOpenParents,
  onCloseParents,
  onDownloadButtonClick,
  onViewMoreVertices,
  onViewAllVertices,
  onTogglePinGroup,
  onHighlightThree,
}) => {
  const getVerticesType = (verticesGroup: VerticesGroup): NodeType => {
    if (verticesGroup.vertices.length > 0) {
      return verticesGroup.vertices[0].type;
    } else {
      return 'Dataset';
    }
  };

  const handleViewMoreVertices = () => {
    if (onViewMoreVertices) {
      onViewMoreVertices(verticesGroup);
    }
  };

  const handleViewAllVertices = () => {
    if (onViewAllVertices) {
      onViewAllVertices(verticesGroup);
    }
  };

  /*  const handleTogglePinGroup = () => {
    if (onTogglePinGroup) {
      onTogglePinGroup(verticesGroup);
    }
  }; */
  const handleHighlight = () => {
    verticesGroup.isHighlighted = !verticesGroup.isHighlighted;
    onHighlightThree!(verticesGroup, verticesGroup.isHighlighted);
  };

  return (
    <>
      {isVisible && (
        <>
          <SVGObject geometry={verticesGroup.geometry} dataTestId="vertex_node">
            <div
              className={`${styles.verticesGroup} ${
                showNodesAsSingle ? styles.verticesGroupNoShadow : ''
              } ${
                verticesGroup.isHighlighted
                  ? styles.verticesGroupHighlighted
                  : ''
              }`}
            >
              {showHeader && (
                <div className={styles.header}>
                  <div className={styles.title}>
                    <div className={styles.labelBlock}>
                      <div
                        className={`${styles.nodeIcon} ${
                          styles[getVerticesType(verticesGroup)]
                        }`}
                      ></div>
                      <div className={styles.label}>{verticesGroup.label}</div>
                      <div className={styles.label}>
                        {verticesGroup.vertices[0].type}
                      </div>
                    </div>
                  </div>
                  <div className={styles.controls}>
                    <div className={styles.downloadSeeAll}>
                      {verticesGroup.visibleVertices <
                        verticesGroup.vertices.length && (
                        <GroupButton
                          label="See all"
                          icon={<EyeIcon />}
                          onClick={handleViewAllVertices}
                          isDisabled={
                            verticesGroup.visibleVertices >=
                            verticesGroup.vertices.length
                          }
                        />
                      )}
                    </div>
                    <div className={styles.highlight}>
                      <GroupButton
                        variant="secondary"
                        label="Highlight Lineage"
                        className={
                          verticesGroup.isHighlighted ? styles.highlight_on : ''
                        }
                        icon={
                          !verticesGroup.isHighlighted ? (
                            <>
                              <HighlightOff />
                            </>
                          ) : (
                            <>
                              <HighlightOn />
                            </>
                          )
                        }
                        onClick={handleHighlight}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.verticesContainer}>
                <div
                  className={`${styles.vertices} ${
                    styles[getVerticesType(verticesGroup)]
                  } ${showNodesAsSingle ? styles.verticesNoBorder : ''}`}
                >
                  {verticesGroup.vertices
                    .slice(0, verticesGroup.visibleVertices)
                    .map(v => (
                      <div
                        key={v.id}
                        style={{
                          position: 'relative',
                          ...(!showHeader
                            ? {}
                            : {
                                height: v.geometry.dimensions.height - 2,
                              }),
                        }}
                      >
                        <VertexNode
                          key={`${verticesGroup.id}_${v.id}`}
                          vertex={{ ...v }}
                          onOpenChildren={onOpenChildren}
                          onCloseChildren={onCloseChildren}
                          onOpenParents={onOpenParents}
                          onCloseParents={onCloseParents}
                          onDownloadButtonClick={onDownloadButtonClick}
                          hideChildrenTooltip={hideChildrenTooltip}
                          showChildrenTooltip={showChildrenTooltip}
                          hideParentsTooltip={hideParentsTooltip}
                          showParentsTooltip={showParentsTooltip}
                          showParentsButton={showParentsButton}
                          showChildrenButton={showChildrenButton}
                          showAsSingleNode={showNodesAsSingle}
                          displayAsSVGObject={false}
                        />
                      </div>
                    ))}
                  {verticesGroup.visibleVertices <
                    verticesGroup.vertices.length && (
                    <div
                      className={styles.viewMoreButton}
                      onClick={handleViewMoreVertices}
                    >
                      <div className={styles.label}>View more</div>
                      <div className={styles.icon}>
                        <EyeIcon />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SVGObject>
          <>
            {verticesGroup.vertices.map(vertex => {
              return (
                <Fragment key={vertex.id}>
                  {vertex.childrenGroups &&
                    vertex.childrenGroups.map((vg, index) => (
                      <VertexNodeGroup
                        key={vg.id + index}
                        verticesGroup={vg}
                        isVisible={true}
                        onOpenChildren={onOpenChildren}
                        onCloseChildren={onCloseChildren}
                        onOpenParents={onOpenParents}
                        onCloseParents={onCloseParents}
                        onDownloadButtonClick={onDownloadButtonClick}
                        onViewMoreVertices={onViewMoreVertices}
                        onViewAllVertices={onViewAllVertices}
                        onTogglePinGroup={onTogglePinGroup}
                        hideChildrenTooltip={hideChildrenTooltip}
                        showChildrenTooltip={showChildrenTooltip}
                        hideParentsTooltip={hideParentsTooltip}
                        showParentsTooltip={showParentsTooltip}
                        showHeader={showHeader}
                        showNodesAsSingle={showNodesAsSingle}
                        showChildrenButton
                        onHighlightThree={handleHighlight}
                      />
                    ))}
                  {vertex.parentsGroups &&
                    vertex.parentsGroups.map((vg, index) => (
                      <VertexNodeGroup
                        key={vg.id + index}
                        verticesGroup={vg}
                        isVisible={true}
                        onOpenChildren={onOpenChildren}
                        onCloseChildren={onCloseChildren}
                        onOpenParents={onOpenParents}
                        onCloseParents={onCloseParents}
                        onDownloadButtonClick={onDownloadButtonClick}
                        onViewMoreVertices={onViewMoreVertices}
                        onTogglePinGroup={onTogglePinGroup}
                        hideChildrenTooltip={hideChildrenTooltip}
                        showChildrenTooltip={showChildrenTooltip}
                        hideParentsTooltip={hideParentsTooltip}
                        showParentsTooltip={showParentsTooltip}
                        showHeader={showHeader}
                        showNodesAsSingle={showNodesAsSingle}
                        showParentsButton
                        onHighlightThree={handleHighlight}
                      />
                    ))}
                  {vertex.childrenEdges?.map(edge => (
                    <EdgeLine key={edge.id} edge={edge} />
                  ))}
                  {vertex.parentsEdges?.map(edge => (
                    <EdgeLine key={edge.id} edge={edge} />
                  ))}
                </Fragment>
              );
            })}
          </>
        </>
      )}
    </>
  );
};

export default VertexNodeGroup;
