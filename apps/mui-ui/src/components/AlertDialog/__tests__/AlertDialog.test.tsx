import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlertDialog from '../AlertDialog';

describe('AlertDialog Component', () => {
  const label = 'Test Label';
  const children = 'Test Content';

  it('renders correctly with given props', () => {
    render(<AlertDialog label={label}>{children}</AlertDialog>);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('opens the dialog when the label is clicked', () => {
    render(<AlertDialog label={label}>{children}</AlertDialog>);
    const labelElement = screen.getByText(label);
    fireEvent.click(labelElement);
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('closes the dialog when the Close button is clicked', async () => {
    render(<AlertDialog label={label}>{children}</AlertDialog>);
    const labelElement = screen.getByText(label);
    fireEvent.click(labelElement); // Open dialog

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton); // Close dialog

    // Wait for the dialog to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
