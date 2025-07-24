import React from 'react';
import { render, screen } from '@testing-library/react';
import { GlossaryMetadata } from '../index';

describe('Dropdown tests', () => {
  it('should render the component', () => {
    const title = 'Test';

    render(
      <GlossaryMetadata title={title} isOpen={true}>
        <p>Test</p>
      </GlossaryMetadata>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
