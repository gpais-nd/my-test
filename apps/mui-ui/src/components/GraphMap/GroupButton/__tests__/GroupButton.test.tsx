import React from 'react';
import { render } from '@testing-library/react';
import GroupButton from '../GroupButton';

describe('GroupButton', () => {
  it('renders without crashing', () => {
    render(<GroupButton label="Test" onClick={() => {}} />);
  });
});
