import React from 'react';
import { render } from '@testing-library/react';
import GridHeaderFilterField from '../GridHeaderFilterField';

describe('GridHeaderFilterField', () => {
  it('renders without crashing with minimal props', () => {
    const filter = {
      type: 'text' as const,
      remoteSearchFields: ['field'],
    };
    render(<GridHeaderFilterField headerName="field" filter={filter} />);
  });
});
