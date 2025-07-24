import { RenderResult, render, screen } from '@testing-library/react';
import { GridPaginatorResults } from '../index';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

interface RenderComponentProps {
  from?: number;
  to?: number;
  totalItemsCount?: number;
  rowsPerPage?: number;
  setRowsPerPage?: () => void;
  rowsPerPageOptions?: number[];
}

const renderComponent = ({
  from = 1,
  to = 10,
  totalItemsCount = 100,
  rowsPerPage = 10,
  setRowsPerPage = () => {},
  rowsPerPageOptions = [],
}: RenderComponentProps): RenderResult =>
  render(
    <GridPaginatorResults
      from={from}
      to={to}
      totalItemsCount={totalItemsCount}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );

describe('GridPaginatorResults tests', () => {
  it('should render the paginator results text', async () => {
    renderComponent({});

    expect(
      screen.getByText('Showing 1 - 10 of 100 results')
    ).toBeInTheDocument();
  });

  it('should render the paginator results text', async () => {
    renderComponent({ to: 15, totalItemsCount: 200, rowsPerPage: 20 });

    expect(
      screen.getByText('Showing 1 - 15 of 200 results')
    ).toBeInTheDocument();
  });

  it('should select an option for rows per page and trigger the function', async () => {
    const setRowsPerPage = jest.fn();

    renderComponent({ setRowsPerPage });

    const rowsPerPageSelector = await screen.findByTestId(
      'dropdownRowsPerPage'
    );

    await act(async () => {
      userEvent.click(rowsPerPageSelector);
    });
    const optionToSelect = await screen.findByTestId('dropdownRowsPerPage30');

    await act(async () => {
      await userEvent.click(optionToSelect);
    });

    expect(setRowsPerPage).toHaveBeenCalledTimes(1);
  });

  it('should select a custom option for rows per page and trigger the function', async () => {
    const setRowsPerPage = jest.fn();

    renderComponent({ setRowsPerPage, rowsPerPageOptions: [12, 24, 36] });

    const rowsPerPageSelector = await screen.findByTestId(
      'dropdownRowsPerPage'
    );

    await act(async () => {
      userEvent.click(rowsPerPageSelector);
    });
    const optionToSelect = await screen.findByTestId('dropdownRowsPerPage24');

    await act(async () => {
      await userEvent.click(optionToSelect);
    });

    expect(setRowsPerPage).toHaveBeenCalledTimes(1);
  });
});
