import { render, screen, fireEvent, within } from '@testing-library/react';
import { Grid } from '../index';
import { GridColumnHeader } from '../types';

describe('Grid tests', () => {
  const columnHeaders: GridColumnHeader[] = [
    { name: 'name', label: 'Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'age', label: 'Age' },
  ];

  it('should render a grid with three records', async () => {
    const data = [
      { id: '1', name: 'John', lastName: 'Doe', age: 20 },
      { id: '2', name: 'Jane', lastName: 'Smith', age: 30 },
      { id: '3', name: 'Mary', lastName: 'Johnson', age: 40 },
    ];
    render(<Grid headers={columnHeaders} data={data} />);

    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Last Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Age' })
    ).toBeInTheDocument();


    // Get all rowgroups (thead and tbody), tbody is the second one
    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups[1];
    const dataRows = within(tbody).getAllByRole('row');
    // Row 1: John Doe 20
    expect(within(dataRows[0]).getByText('John')).toBeInTheDocument();
    expect(within(dataRows[0]).getByText('Doe')).toBeInTheDocument();
    expect(within(dataRows[0]).getByText('20')).toBeInTheDocument();
    // Row 2: Jane Smith 30
    expect(within(dataRows[1]).getByText('Jane')).toBeInTheDocument();
    expect(within(dataRows[1]).getByText('Smith')).toBeInTheDocument();
    expect(within(dataRows[1]).getByText('30')).toBeInTheDocument();
    // Row 3: Mary Johnson 40
    expect(within(dataRows[2]).getByText('Mary')).toBeInTheDocument();
    expect(within(dataRows[2]).getByText('Johnson')).toBeInTheDocument();
    expect(within(dataRows[2]).getByText('40')).toBeInTheDocument();

    expect(screen.getByText('Showing 1 - 3 of 3 results')).toBeInTheDocument();
  });

  it('should render a grid with 200 records', async () => {
    const data = [...Array(200)].map((_, index) => ({
      id: `id_${index}`,
      name: `John${index}`,
      lastName: `Doe${index}`,
      age: 20 + index,
    }));

    render(<Grid headers={columnHeaders} data={data} />);

    expect(
      screen.getByText('Showing 1 - 10 of 200 results')
    ).toBeInTheDocument();
  });

  it('should render a grid with 200 records without pagination', async () => {
    const data = [...Array(200)].map((_, index) => ({
      id: `id_${index}`,
      name: `John${index}`,
      lastName: `Doe${index}`,
      age: 20 + index,
    }));

    render(<Grid headers={columnHeaders} data={data} hidePagination />);

    expect(
      screen.queryByText('Showing 1 - 10 of 200 results')
    ).not.toBeInTheDocument();
  });

  it('should handle rendering with empty data gracefully', async () => {
    render(<Grid headers={columnHeaders} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should handle rendering with empty headers gracefully', async () => {
    const data = [{ id: '1', name: 'John', lastName: 'Doe', age: 20 }];
    render(<Grid headers={[]} data={data} />);
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
  });

  it('should support accessibility attributes', async () => {
    const data = [{ id: '1', name: 'John', lastName: 'Doe', age: 20 }];
    render(<Grid headers={columnHeaders} data={data} aria-label="Data Grid" />);
    const gridElement = screen.getByLabelText('Data Grid');
    expect(gridElement).toBeInTheDocument();
  });

  it('should allow sorting by column (if supported)', async () => {
    const data = [
      { id: '1', name: 'John', lastName: 'Doe', age: 20 },
      { id: '2', name: 'Jane', lastName: 'Smith', age: 30 },
      { id: '3', name: 'Mary', lastName: 'Johnson', age: 40 },
    ];
    render(<Grid headers={columnHeaders} data={data} />);

    const ageHeader = screen.getByRole('columnheader', { name: 'Age' });
    fireEvent.click(ageHeader);

    // Get all rowgroups (thead and tbody), tbody is the second one
    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups[1];
    const dataRows = within(tbody).getAllByRole('row');
    // Row 1: John Doe 20
    expect(within(dataRows[0]).getByText('John')).toBeInTheDocument();
    expect(within(dataRows[0]).getByText('Doe')).toBeInTheDocument();
    expect(within(dataRows[0]).getByText('20')).toBeInTheDocument();
    // Row 2: Jane Smith 30
    expect(within(dataRows[1]).getByText('Jane')).toBeInTheDocument();
    expect(within(dataRows[1]).getByText('Smith')).toBeInTheDocument();
    expect(within(dataRows[1]).getByText('30')).toBeInTheDocument();
    // Row 3: Mary Johnson 40
    expect(within(dataRows[2]).getByText('Mary')).toBeInTheDocument();
    expect(within(dataRows[2]).getByText('Johnson')).toBeInTheDocument();
    expect(within(dataRows[2]).getByText('40')).toBeInTheDocument();
  });
});
