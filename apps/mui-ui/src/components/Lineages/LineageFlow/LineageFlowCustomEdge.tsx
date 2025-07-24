import { type FC } from 'react';
import {
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
  getSmoothStepPath,
} from '@xyflow/react';

function EdgeLabel({ transform, label }: { transform: string; label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        padding: '0',
        top: -10,
        color: '#111',
        fontSize: 6,
        fontWeight: 400,
        transform,
        zIndex: 10,
      }}
      className="nodrag nopan"
    >
      {label}
    </div>
  );
}

const LineageFlowCustomEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  markerStart,
  style,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const xPosition = sourcePosition === 'left' ? '0%' : '-100%';
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={style}
      />
      {data && (
        <div style={{ position: 'relative' }}>
          <EdgeLabelRenderer>
            {data.label && (
              <EdgeLabel
                transform={`translate(${xPosition}, -50%) translate(${targetX}px,${targetY}px)`}
                label={data?.label.toString()}
              />
            )}
          </EdgeLabelRenderer>
        </div>
      )}
    </>
  );
};

export default LineageFlowCustomEdge;
