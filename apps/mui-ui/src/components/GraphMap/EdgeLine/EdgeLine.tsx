import { FC } from 'react';
import { Edge, Point } from '../GraphMap.types';
import {
  GROUP_HORIZONTAL_SPACE,
  LINE_BASE_COLOR,
  LINE_LABEL_H_OFFSET,
  LINE_LABEL_V_OFFSET,
  LINE_OFFSET_BY_TOGGLE_BUTTON,
  LINE_RADIUS,
  MIN_LINE_GAP,
  getGeometryCenter,
  getGeometrySides,
  zeroPoint,
} from '../GraphMap.functions';

interface PathPoint {
  path: string;
  originLabelPoint?: Point;
  targetLabelPoint?: Point;
}

const getStraightLine = (
  originPoint: Point,
  targetPoint: Point,
  originOffset = zeroPoint,
  targetOffset = zeroPoint
): PathPoint => {
  const originLabelPoint = {
    x:
      originPoint.x +
      (originPoint.x < targetPoint.x
        ? LINE_LABEL_H_OFFSET
        : -LINE_LABEL_H_OFFSET),
    y: originPoint.y - LINE_LABEL_V_OFFSET,
  };
  const targetLabelPoint = {
    x:
      targetPoint.x +
      (originPoint.x < targetPoint.x
        ? -LINE_LABEL_H_OFFSET
        : LINE_LABEL_H_OFFSET),
    y: targetPoint.y + targetOffset.y - LINE_LABEL_V_OFFSET,
  };
  return {
    path: `
      M ${originPoint.x + originOffset.x} ${originPoint.y + originOffset.y}
      L ${targetPoint.x + targetOffset.x} ${targetPoint.y + targetOffset.y}
    `,
    originLabelPoint,
    targetLabelPoint,
  };
};

const getRightCurve = (
  originPoint: Point,
  targetPoint: Point,
  originOffset = zeroPoint,
  targetOffset = zeroPoint
): PathPoint => {
  const halfHorizontalSpace = originPoint.x + GROUP_HORIZONTAL_SPACE / 2;
  const posFrom = `${originPoint.x} ${originPoint.y + originOffset.y}`;
  const endLine1 = `${halfHorizontalSpace - LINE_RADIUS} ${originPoint.y}`;
  const directionCurve1 = originPoint.y > targetPoint.y ? '0' : '1';
  const endCurve1 = `${halfHorizontalSpace} ${
    originPoint.y + (originPoint.y < targetPoint.y ? LINE_RADIUS : -LINE_RADIUS)
  }`;
  const endLine2 = `${halfHorizontalSpace} ${
    targetPoint.y + (originPoint.y > targetPoint.y ? LINE_RADIUS : -LINE_RADIUS)
  }`;
  const endCurve2 = `${halfHorizontalSpace + LINE_RADIUS} ${targetPoint.y}`;
  const directionCurve2 = originPoint.y < targetPoint.y ? '0' : '1';
  const endLine3 = `${
    originPoint.x + targetOffset.x + LINE_RADIUS + GROUP_HORIZONTAL_SPACE
  } ${targetPoint.y + targetOffset.y}`;
  const originLabelPoint = {
    x: originPoint.x + LINE_LABEL_H_OFFSET,
    y: originPoint.y - LINE_LABEL_V_OFFSET,
  };
  const targetLabelPoint = {
    x: originPoint.x + targetOffset.x - LINE_RADIUS + GROUP_HORIZONTAL_SPACE,
    y: targetPoint.y + targetOffset.y - LINE_RADIUS / 2,
  };

  return {
    path: `
      M ${posFrom}
      L ${endLine1}
      A ${LINE_RADIUS} ${LINE_RADIUS} 0 0 ${directionCurve1} ${endCurve1}
      L ${endLine2}
      A ${LINE_RADIUS} ${LINE_RADIUS} 0 0 ${directionCurve2} ${endCurve2}
      L ${endLine3}
    `,
    originLabelPoint,
    targetLabelPoint,
  };
};

const getLeftCurve = (
  originPoint: Point,
  targetPoint: Point,
  targetOffset = zeroPoint
): PathPoint => {
  const halfHorizontalSpace = originPoint.x - GROUP_HORIZONTAL_SPACE / 2;
  const posFrom = `${originPoint.x} ${originPoint.y}`;
  const endLine1 = `${halfHorizontalSpace + LINE_RADIUS} ${originPoint.y}`;
  const directionCurve1 = originPoint.y > targetPoint.y ? '1' : '0';
  const endCurve1 = `${halfHorizontalSpace} ${
    originPoint.y + (originPoint.y < targetPoint.y ? LINE_RADIUS : -LINE_RADIUS)
  }`;
  const endLine2 = `${halfHorizontalSpace} ${
    targetPoint.y + (originPoint.y > targetPoint.y ? LINE_RADIUS : -LINE_RADIUS)
  }`;
  const endCurve2 = `${halfHorizontalSpace - LINE_RADIUS} ${targetPoint.y}`;
  const directionCurve2 = originPoint.y < targetPoint.y ? '1' : '0';
  const endLine3 = `${
    originPoint.x + targetOffset.x - LINE_RADIUS - GROUP_HORIZONTAL_SPACE
  } ${targetPoint.y + targetOffset.y}`;
  const originLabelPoint = {
    x: originPoint.x - LINE_LABEL_H_OFFSET,
    y: originPoint.y - LINE_LABEL_V_OFFSET,
  };
  const targetLabelPoint = {
    x: originPoint.x + targetOffset.x + LINE_RADIUS - GROUP_HORIZONTAL_SPACE,
    y: targetPoint.y + targetOffset.y - LINE_RADIUS / 2,
  };

  return {
    path: `
      M ${posFrom}
      L ${endLine1}
      A ${LINE_RADIUS} ${LINE_RADIUS} 0 0 ${directionCurve1} ${endCurve1}
      L ${endLine2}
      A ${LINE_RADIUS} ${LINE_RADIUS} 0 0 ${directionCurve2} ${endCurve2}
      L ${endLine3}
    `,
    originLabelPoint,
    targetLabelPoint,
  };
};

const getEdgeStringLine = (edge: Edge): PathPoint => {
  let pathPoint: PathPoint = { path: '' };
  const originSides = getGeometrySides(edge.origin);
  const targetSides = getGeometrySides(edge.target);
  const xOffsetLeft: Point = {
    x: -LINE_OFFSET_BY_TOGGLE_BUTTON,
    y: 0,
  };
  const xOffsetRight: Point = {
    x: LINE_OFFSET_BY_TOGGLE_BUTTON - 5,
    y: 0,
  };

  if (targetSides.left.x > originSides.right.x + MIN_LINE_GAP) {
    if (Math.abs(originSides.right.y - targetSides.left.y) < LINE_RADIUS) {
      pathPoint = getStraightLine(
        originSides.right,
        {
          ...targetSides.left,
          y: originSides.right.y,
        },
        xOffsetLeft,
        xOffsetRight
      );
    } else {
      pathPoint = getRightCurve(
        originSides.right,
        targetSides.left,
        xOffsetLeft,
        xOffsetLeft
      );
    }
  } else if (targetSides.right.x < originSides.left.x + MIN_LINE_GAP) {
    if (Math.abs(originSides.left.y - targetSides.left.y) < LINE_RADIUS) {
      pathPoint = getStraightLine(
        originSides.left,
        {
          ...targetSides.right,
          y: originSides.left.y,
        },
        xOffsetRight,
        xOffsetLeft
      );
    } else {
      pathPoint = getLeftCurve(
        originSides.left,
        targetSides.right,
        xOffsetRight
      );
    }
  } else if (targetSides.bottom.y < originSides.top.y + MIN_LINE_GAP) {
    pathPoint = getStraightLine(originSides.top, targetSides.bottom);
  } else if (targetSides.top.y > originSides.bottom.y + MIN_LINE_GAP) {
    pathPoint = getStraightLine(originSides.bottom, targetSides.top);
  } else {
    pathPoint = getStraightLine(
      getGeometryCenter(edge.origin),
      getGeometryCenter(edge.target)
    );
  }
  return pathPoint;
};

interface Props {
  edge: Edge;
  color?: string;
}

const EdgeLine: FC<Props> = ({ edge, color = LINE_BASE_COLOR }) => {
  const { path, originLabelPoint, targetLabelPoint } = getEdgeStringLine(edge);
  return (
    <>
      <path
        data-testid={edge.id}
        d={path}
        fill="none"
        strokeWidth="0.5"
        stroke={color}
        // markerEnd="url(#arrowhead)"
      />
      {originLabelPoint && (
        <text
          x={originLabelPoint.x}
          y={originLabelPoint.y}
          fill={color}
          fontSize="7"
          textAnchor="middle"
          dy="-0.3em"
        >
          {edge.originLabel}
        </text>
      )}
      {targetLabelPoint && (
        <text
          x={targetLabelPoint.x}
          y={targetLabelPoint.y}
          fill={color}
          fontSize="7"
          textAnchor="middle"
          dy="-0.3em"
        >
          {edge.targetLabel}
        </text>
      )}
    </>
  );
};

export default EdgeLine;
