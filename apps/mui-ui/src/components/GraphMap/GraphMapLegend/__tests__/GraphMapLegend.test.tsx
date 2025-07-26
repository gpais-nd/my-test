import React from 'react';
import { render, screen } from '@testing-library/react';
import GraphMapLegend from '../GraphMapLegend';

describe('GraphMapLegend', () => {
  it('renders without crashing and displays children', () => {
    render(
      <GraphMapLegend>
        <span>Legend Content</span>
      </GraphMapLegend>
    );
    expect(screen.getByText('Legend Content')).toBeInTheDocument();
  });
});
