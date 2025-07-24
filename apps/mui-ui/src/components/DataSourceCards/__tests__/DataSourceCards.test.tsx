jest.mock('config/TableauWidgets.config', () => ({
  TableauWidgetsConfig: {},
}));
jest.mock('config/TableauDataset.config', () => ({
  TableauDatasetConfig: {},
}));
jest.mock('config/TableauDashboard.config', () => ({
  TableauDashboardConfig: {},
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import DataSourceCards from '../DataSourceCards';

describe('DataSourceCards Component', () => {
  const mockDataSources = [
    {
      id: '1',
      name: 'DataSource 1',
      type: 'Tableau',
      description: 'Test description 1',
    },
    {
      id: '2',
      name: 'DataSource 2',
      type: 'Looker',
      description: 'Test description 2',
    },
  ];

  it('renders all data source cards', () => {
    render(<DataSourceCards dataSources={mockDataSources} />);
    expect(screen.getByText('DataSource 1')).toBeInTheDocument();
    expect(screen.getByText('DataSource 2')).toBeInTheDocument();
  });

  it('renders data source descriptions', () => {
    render(<DataSourceCards dataSources={mockDataSources} />);
    expect(screen.getByText('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Test description 2')).toBeInTheDocument();
  });

  it('handles empty data sources gracefully', () => {
    render(<DataSourceCards dataSources={[]} />);
    expect(screen.queryByText('DataSource 1')).not.toBeInTheDocument();
    expect(screen.queryByText('DataSource 2')).not.toBeInTheDocument();
  });
});
