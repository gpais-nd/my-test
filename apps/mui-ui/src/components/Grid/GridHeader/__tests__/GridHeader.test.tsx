import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { GridHeader } from '../index';
import { SortDirection, GridColumnHeader } from 'components/Grid/types';
import userEvent from '@testing-library/user-event';

const renderComponent = (component: ReactElement) => {
  render(<table>{component}</table>);
};

describe('GridHeader tests', () => {
  const columnHeaders: GridColumnHeader[] = [
    {
      name: 'name',
      label: 'Name',
      sortable: true,
      className: 'styleClassName',
      remoteSortField: 'remoteName',
    },
    { name: 'lastName', label: 'Last Name' },
    { name: 'age', label: 'Age' },
  ];

  it('should render the headers', async () => {
    renderComponent(<GridHeader headers={columnHeaders} />);

    expect(
      screen.getByRole('columnheader', { name: 'Name Sort by' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Last Name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Age' })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Sort by' })).toBeInTheDocument();
  });

  it('should change the sort direction of a column to ASC', async () => {
    const onSortColumn = jest.fn();
    renderComponent(
      <GridHeader headers={columnHeaders} onSortColumn={onSortColumn} />
    );

    const nameHeader = screen.getByRole('columnheader', {
      name: 'Name Sort by',
    });

    await userEvent.click(nameHeader);
    expect(onSortColumn).toHaveBeenCalledTimes(1);

    expect(onSortColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'name',
        sortDirection: SortDirection.ASC,
        remoteSortField: 'remoteName',
      })
    );
  });

  it('should change the sort direction of a column to ASC', async () => {
    const onSortColumn = jest.fn();
    const customColumnHeaders: GridColumnHeader[] = [
      {
        ...columnHeaders[0],
        sortDirection: SortDirection.NONE,
      },
    ];

    renderComponent(
      <GridHeader headers={customColumnHeaders} onSortColumn={onSortColumn} />
    );

    const nameHeader = screen.getByRole('columnheader', {
      name: 'Name Sort by',
    });

    await userEvent.click(nameHeader);
    expect(onSortColumn).toHaveBeenCalledTimes(1);
    expect(onSortColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'name',
        sortDirection: SortDirection.ASC,
        remoteSortField: 'remoteName',
      })
    );
  });

  it('should change the sort direction of a column to DESC', async () => {
    const onSortColumn = jest.fn();
    const customColumnHeaders: GridColumnHeader[] = [
      {
        ...columnHeaders[0],
        sortDirection: SortDirection.ASC,
      },
    ];

    renderComponent(
      <GridHeader headers={customColumnHeaders} onSortColumn={onSortColumn} />
    );

    const nameHeader = screen.getByRole('columnheader', {
      name: 'Name Sort by',
    });

    await userEvent.click(nameHeader);
    expect(onSortColumn).toHaveBeenCalledTimes(1);
    expect(onSortColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'name',
        sortDirection: SortDirection.DESC,
        remoteSortField: 'remoteName',
      })
    );
  });

  it('should reset the sort direction of a column', async () => {
    const onSortColumn = jest.fn();
    const customColumnHeaders: GridColumnHeader[] = [
      {
        ...columnHeaders[0],
        sortDirection: SortDirection.DESC,
      },
    ];

    renderComponent(
      <GridHeader headers={customColumnHeaders} onSortColumn={onSortColumn} />
    );

    const nameHeader = screen.getByRole('columnheader', {
      name: 'Name Sort by',
    });

    await userEvent.click(nameHeader);
    expect(onSortColumn).toHaveBeenCalledTimes(1);
    expect(onSortColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'name',
        sortDirection: SortDirection.NONE,
        remoteSortField: 'remoteName',
      })
    );
  });
});
