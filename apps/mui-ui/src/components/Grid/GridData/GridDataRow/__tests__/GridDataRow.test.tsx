import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { GridDataRow } from '../index';
import { GridColumnHeader } from 'components/Grid/types';

const renderComponent = (component: ReactElement) => {
  render(
    <table>
      <tbody>{component}</tbody>
    </table>
  );
};

describe('GridRow tests', () => {
  const columnHeaders: GridColumnHeader[] = [
    { name: 'name', label: 'Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'age', label: 'Age' },
  ];

  it('should render the data of a record in a row', async () => {
    const record = { name: 'John', lastName: 'Doe', age: 20 };
    renderComponent(<GridDataRow headers={columnHeaders} record={record} />);

    const cells = screen.getAllByRole('cell');

    expect(cells[0]).toHaveTextContent('John');
    expect(cells[1]).toHaveTextContent('Doe');
    expect(cells[2]).toHaveTextContent('20');
  });
});
