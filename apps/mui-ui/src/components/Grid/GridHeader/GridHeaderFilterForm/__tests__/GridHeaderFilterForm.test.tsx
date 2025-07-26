import React from 'react';
import { render, screen } from '@testing-library/react';
import GridHeaderFilterForm from '../GridHeaderFilterForm';

describe('GridHeaderFilterForm', () => {
  it('renders correct number of th elements for minimal headers', () => {
    const headers = [
      { name: 'col1', label: 'Column 1' },
      { name: 'col2', label: 'Column 2' },
    ];
    render(<table><tbody><tr><GridHeaderFilterForm headers={headers} /></tr></tbody></table>);
    // Should render two <th> (one for each header)
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });
});
