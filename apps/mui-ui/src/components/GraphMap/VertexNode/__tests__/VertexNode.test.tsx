import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import VertexNode from '../VertexNode';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { Vertex } from '../../GraphMap.types';

const renderComponent = (component: ReactElement) => {
  render(
    <svg height={500} width={1500}>
      {component}
    </svg>
  );
};

describe('VertexNode tests', () => {
  it('should render a single VertexNode in the svg', () => {
    const vertex: Vertex = {
      id: 'testing_vertex',
      content: 'Testing Vertex',
      x: 100,
      y: 100,
      height: 30,
      width: 100,
      level: 0,
    };

    renderComponent(<VertexNode vertex={vertex} />);
    expect(screen.getByText('Testing Vertex')).toBeInTheDocument();
  });

  it('should render a VertexNode with children', () => {
    const vertex: Vertex = {
      id: 'testing_vertex',
      content: 'Testing Vertex',
      x: 100,
      y: 100,
      height: 30,
      width: 100,
      level: 0,
      children: [
        { id: 'child_1', content: 'Child 1', level: 1 },
        { id: 'child_2', content: 'Child 2', level: 1 },
      ],
    };

    renderComponent(<VertexNode vertex={vertex} />);

    expect(screen.getByText('Testing Vertex')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should open and close children vertices', async () => {
    const vertex: Vertex = {
      id: 'testing_vertex',
      content: 'Testing Vertex',
      x: 100,
      y: 100,
      height: 30,
      width: 100,
      level: 0,
      children: [
        { id: 'child_1', content: 'Child 1', level: 1 },
        { id: 'child_2', content: 'Child 2', level: 1 },
      ],
    };

    renderComponent(<VertexNode vertex={vertex} />);

    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Child 2')).not.toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: '+' });
    await act(async () => {
      await userEvent.click(toggleButton);
    });

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
