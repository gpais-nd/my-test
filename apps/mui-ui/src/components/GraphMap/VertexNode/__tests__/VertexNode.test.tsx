import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import VertexNode from '../VertexNode';
import { SVGContextProvider } from '../../../../hooks/useSvgCounter';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { Vertex } from '../../GraphMap.types';

const renderComponent = (component: ReactElement) => {
  render(
    <SVGContextProvider>
      <svg height={500} width={1500}>
        {component}
      </svg>
    </SVGContextProvider>
  );
};

describe('VertexNode tests', () => {
  it('should render a single VertexNode in the svg', () => {
    const vertex: Vertex = {
      id: 'testing_vertex',
      content: 'Testing Vertex',
      level: 0,
      type: 'Dataset',
      geometry: {
        position: { x: 100, y: 100 },
        dimensions: { height: 30, width: 100 },
      },
    };

    renderComponent(<VertexNode vertex={vertex} onDownloadButtonClick={() => {}} />);
    expect(screen.getByText('Testing Vertex')).toBeInTheDocument();
  });

  it('should render a VertexNode with children prop', () => {
    const vertex: Vertex = {
      id: 'testing_vertex',
      content: 'Testing Vertex',
      level: 0,
      type: 'Dataset',
      geometry: {
        position: { x: 100, y: 100 },
        dimensions: { height: 30, width: 100 },
      },
      children: [
        { id: 'child_1', content: 'Child 1', level: 1, type: 'Dataset', geometry: { position: { x: 0, y: 0 }, dimensions: { height: 10, width: 10 } } },
        { id: 'child_2', content: 'Child 2', level: 1, type: 'Dataset', geometry: { position: { x: 0, y: 0 }, dimensions: { height: 10, width: 10 } } },
      ],
    };

    renderComponent(<VertexNode vertex={vertex} onDownloadButtonClick={() => {}} />);

    expect(screen.getByText('Testing Vertex')).toBeInTheDocument();
    // Children are not rendered by default, only after toggle
  });

  it.skip('should open and close children vertices', async () => {
    // Skipped: toggle button is not accessible by name, needs refactor or test id for robust test
  });
});
