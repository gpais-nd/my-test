import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { GridData } from '../index';
import { GridColumnHeader } from 'components/Grid/types';

const renderComponent = (component: ReactElement) => {
  render(<table>{component}</table>);
};

describe('GridData tests', () => {
  const columnHeaders: GridColumnHeader[] = [
    { name: 'name', label: 'Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'age', label: 'Age' },
  ];

  it('should render a data in the grid', async () => {
    const data = [
      { id: '1', name: 'John', lastName: 'Doe', age: 20 },
      { id: '2', name: 'Jane', lastName: 'Smith', age: 30 },
      { id: '3', name: 'Mary', lastName: 'Johnson', age: 40 },
    ];
    renderComponent(<GridData headers={columnHeaders} data={data} />);

    const rows = screen.getAllByRole('row');

    expect(rows[0]).toHaveTextContent('JohnDoe20');
    expect(rows[1]).toHaveTextContent('JaneSmith30');
    expect(rows[2]).toHaveTextContent('MaryJohnson40');
  });
});
