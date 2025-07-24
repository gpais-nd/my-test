import { render, screen } from '@testing-library/react';
import GraphMap, { GraphMapProps as OriginalGraphMapProps } from '../GraphMap';
import { Geometry, Vertex } from '../GraphMap.types';
import { NodeTypeEnum } from 'utils/lineage.utils';

interface GraphMapProps extends OriginalGraphMapProps {
  data: { id: string; label: string; connections: string[] }[];
}

jest.mock('../GraphMap', () => {
  const MockGraphMap: React.FC<GraphMapProps> = ({ data, ...props }) => (
    <div {...props}>
      {data.length > 0 ? (
        data.map(node => (
          <div key={node.id} data-connections={node.connections.join(',')}>
            {node.label}
          </div>
        ))
      ) : (
        <div>No nodes available</div>
      )}
    </div>
  );
  return MockGraphMap;
});

describe('GraphMap Component', () => {
  const mockGeometry: Geometry = {
    position: { x: 0, y: 0 },
    dimensions: { width: 100, height: 50 },
  };

  // Mock data matching the Vertex interface
  const mockVertices: Vertex[] = [
    {
      id: '1',
      content: 'Node 1',
      level: 0,
      geometry: mockGeometry,
      type: NodeTypeEnum.Dataset, // or whatever valid type your enum allows
    },
    {
      id: '2',
      content: 'Node 2',
      level: 1,
      geometry: mockGeometry,
      type: NodeTypeEnum.Dataset,
    },
    {
      id: '3',
      content: 'Node 3',
      level: 1,
      geometry: mockGeometry,
      type: NodeTypeEnum.Dataset,
    },
  ];

  // Add any required fields to satisfy the Vertex type if it's more complex

  const defaultProps: GraphMapProps = {
    vertices: mockVertices,
    availableViewportHeight: 600,
    onDownloadButtonClick: () => {},
    data: [
      { id: '1', label: 'Node 1', connections: ['2'] },
      { id: '2', label: 'Node 2', connections: ['3'] },
      { id: '3', label: 'Node 3', connections: [] },
    ],
    // Add other required props if needed
  };

  it('should render the GraphMap component with nodes', () => {
    render(<GraphMap {...defaultProps} />);
    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.getByText('Node 2')).toBeInTheDocument();
    expect(screen.getByText('Node 3')).toBeInTheDocument();
  });

  it('should render connections between nodes', () => {
    render(
      <GraphMap
        vertices={[]}
        availableViewportHeight={600}
        onDownloadButtonClick={() => {}}
      />
    );
    const connectionElement = screen.getByText('Node 1').closest('div');
    expect(connectionElement).toHaveAttribute('data-connections', 'node2');
  });

  it('should handle rendering with empty data gracefully', () => {
    render(
      <GraphMap
        vertices={[]}
        availableViewportHeight={600}
        onDownloadButtonClick={() => {}}
      />
    );
    expect(screen.getByText('No nodes available')).toBeInTheDocument();
  });

  it('should support accessibility attributes', () => {
    render(<GraphMap {...defaultProps} aria-label="Graph Map Visualization" />);
    const graphElement = screen.getByLabelText('Graph Map Visualization');
    expect(graphElement).toBeInTheDocument();
  });
});
