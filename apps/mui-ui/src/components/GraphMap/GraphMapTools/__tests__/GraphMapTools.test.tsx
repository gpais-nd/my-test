import React from 'react';
import { render } from '@testing-library/react';
import GraphMapTools from '../GraphMapTools';

describe('GraphMapTools', () => {
  it('renders without crashing with minimal props', () => {
    render(<GraphMapTools availableGroupNames={[]} filteredGroupNames={[]} showGrouping={false} />);
  });
});
