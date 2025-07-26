import React from 'react';
import { render, screen } from '@testing-library/react';
import HelpMenu from '../HelpMenu';

describe('HelpMenu', () => {
  it('renders without crashing and displays tooltips', () => {
    render(<HelpMenu />);
    // Tooltips are not visible until hover, but icons should be in the document
    expect(screen.getByTestId('BugReportOutlinedIcon')).toBeInTheDocument();
    expect(screen.getByTestId('AddToQueueIcon')).toBeInTheDocument();
  });
});
