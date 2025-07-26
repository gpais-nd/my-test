
import React from 'react';
import { render } from '@testing-library/react';
import VertexNodeGroup from '../VertexNodeGroup';
import { VerticesGroup } from '../../GraphMap.types';
import { SVGContextProvider } from '../../../../hooks/useSvgCounter';

const mockVerticesGroup: VerticesGroup = {
  id: 'group-1',
  label: 'Test Group',
  level: 0,
  vertices: [
    {
      id: 'vertex-1',
      content: null,
      level: 0,
      geometry: {
        position: { x: 0, y: 0 },
        dimensions: { height: 10, width: 10 },
      },
      type: 'Dataset',
    },
  ],
  visibleVertices: 1,
  geometry: {
    position: { x: 0, y: 0 },
    dimensions: { height: 10, width: 10 },
  },
  isPinned: false,
  isHighlighted: false,
};

describe('VertexNodeGroup', () => {
  it('renders without crashing', () => {
    render(
      <SVGContextProvider>
        <VertexNodeGroup
          verticesGroup={mockVerticesGroup}
          isVisible={true}
          onDownloadButtonClick={() => {}}
        />
      </SVGContextProvider>
    );
  });
});
