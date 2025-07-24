import { RenderResult, render, screen } from '@testing-library/react';
import { GridPaginator } from '../index';
import userEvent from '@testing-library/user-event';

interface RenderComponentProps {
  activePage?: number;
  rowsPerPage?: number;
  totalItemsCount?: number;
  rowsFrom?: number;
  rowsTo?: number;
  pageRangeDisplayed?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const renderComponent = ({
  activePage = 1,
  rowsPerPage = 10,
  totalItemsCount = 100,
  rowsFrom = 1,
  rowsTo = 10,
  pageRangeDisplayed = 5,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}: RenderComponentProps): RenderResult =>
  render(
    <GridPaginator
      activePage={activePage}
      rowsPerPage={rowsPerPage}
      totalItemsCount={totalItemsCount}
      rowsFrom={rowsFrom}
      rowsTo={rowsTo}
      pageRangeDisplayed={pageRangeDisplayed}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );

describe('GridPaginator tests', () => {
  it('should render the paginator with default valued', async () => {
    renderComponent({});

    expect(
      screen.getByText('Showing 1 - 10 of 100 results')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 3' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 4' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 5' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Go to page number 6' })
    ).not.toBeInTheDocument();
  });

  it('should test next and last buttons', async () => {
    const onPageChange = jest.fn();
    renderComponent({ totalItemsCount: 500, onPageChange });

    const next = screen.getByRole('link', { name: 'Go to next page' });
    const last = screen.getByRole('link', { name: 'Go to last page' });

    await userEvent.click(next);
    expect(onPageChange).toHaveBeenCalledTimes(1);

    await userEvent.click(last);
    expect(onPageChange).toHaveBeenCalledTimes(2);
  });

  it('should prev and fist buttons', async () => {
    const onPageChange = jest.fn();
    renderComponent({ activePage: 20, totalItemsCount: 500, onPageChange });

    const first = screen.getByRole('link', { name: 'Go to first page' });
    const prev = screen.getByRole('link', { name: 'Go to previous page' });

    await userEvent.click(prev);
    expect(onPageChange).toHaveBeenCalledTimes(1);

    await userEvent.click(first);
    expect(onPageChange).toHaveBeenCalledTimes(2);
  });

  it('should render the paginator with a custom with a custom page range', async () => {
    renderComponent({ pageRangeDisplayed: 3, totalItemsCount: 500 });

    expect(
      screen.getByRole('link', { name: 'Go to page number 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to page number 3' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Go to page number 4' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Go to page number 5' })
    ).not.toBeInTheDocument();
  });
});
