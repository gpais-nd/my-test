import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Edge, Geometry } from '../../GraphMap.types';
import EdgeLine from '../EdgeLine';

const renderComponent = (component: ReactElement) => {
  render(
    <svg height={500} width={1500}>
      {component}
    </svg>
  );
};

describe('EdgeLine tests', () => {
  const origin: Geometry = {
    dimensions: {
      height: 20,
      width: 100,
    },
    position: {
      x: 100,
      y: 100,
    },
  };

  const target: Geometry = {
    dimensions: {
      height: 20,
      width: 100,
    },
    position: {
      x: 200,
      y: 200,
    },
  };
  const edge: Edge = {
    id: 'origin=>child<=target',
    origin,
    target,
    relationship: 'child',
  };

  it('should render a EdgeLine in the svg', async () => {
    renderComponent(<EdgeLine edge={edge} />);

    const edgeLine = screen.getByTestId('origin=>child<=target');

    expect(edgeLine).toBeInTheDocument();
    expect(edgeLine).toHaveAttribute(
      'd',
      `
    M 150 120
    L 250 200
  `
    );

    expect(edgeLine).toHaveAttribute('stroke-width', '0.5');
  });
});
