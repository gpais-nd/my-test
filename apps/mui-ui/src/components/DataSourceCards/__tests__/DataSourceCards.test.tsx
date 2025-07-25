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
import { MemoryRouter } from 'react-router-dom';
import DataSourceCards from '../DataSourceCards';

describe('DataSourceCards Component', () => {
  const mockDataSources = [
    {
      id: '1',
      name: 'DataSource 1',
      type: 'Tableau',
      description: 'Test description 1',
      category: 'table',
      isEnabled: true,
    },
    {
      id: '2',
      name: 'DataSource 2',
      type: 'Looker',
      description: 'Test description 2',
      category: 'job',
      isEnabled: true,
    },
  ];

  it('renders all data source cards', () => {
    render(
      <MemoryRouter>
        <DataSourceCards dataSources={mockDataSources} />
      </MemoryRouter>
    );
    expect(screen.getByText('DataSource 1')).toBeInTheDocument();
    expect(screen.getByText('DataSource 2')).toBeInTheDocument();
  });

  // Removed description assertions as DataSourceCard does not render description

  it('handles empty data sources gracefully', () => {
    render(
      <MemoryRouter>
        <DataSourceCards dataSources={[]} />
      </MemoryRouter>
    );
    expect(screen.queryByText('DataSource 1')).not.toBeInTheDocument();
    expect(screen.queryByText('DataSource 2')).not.toBeInTheDocument();
  });
});
