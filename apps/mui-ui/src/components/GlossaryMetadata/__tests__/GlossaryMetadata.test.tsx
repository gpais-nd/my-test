import React from 'react';
import { render, screen } from '@testing-library/react';
import GlossaryMetadata from '../index';

describe('GlossaryMetadata', () => {
  it('renders a glossary item label', () => {
    const data = [
      { name: 'alpha', label: 'Alpha', description: 'First letter' },
      { name: 'beta', label: 'Beta', description: 'Second letter' },
    ];
    render(<GlossaryMetadata data={data} selectedLetter="A" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });
});
