import { FC } from 'react';
import { LINE_BASE_COLOR } from '../GraphMap.functions';

const EdgeLineArrow: FC = () => {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="8"
        markerHeight="7"
        refX="8"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill={LINE_BASE_COLOR} />
      </marker>
    </defs>
  );
};

export default EdgeLineArrow;
