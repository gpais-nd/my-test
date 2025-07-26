import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { DataSourceCard } from '../index';
import { DataSource } from '../../../../types/entities.types';
import { BrowserRouter } from 'react-router-dom';

const renderComponent = (component: ReactElement) => {
  render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DataSource tests', () => {
  it('should render the component', () => {
    const dataSource: DataSource = {
      id: '12345',
      name: 'DeltaLake',
      numberOfTables: 432,
      isEnabled: true,
    };

    renderComponent(<DataSourceCard dataSource={dataSource} />);

    expect(screen.getByText('DeltaLake')).toBeInTheDocument();
    expect(screen.getByText('432 Tables')).toBeInTheDocument();
  });
});
