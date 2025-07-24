import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeDialog from '../CodeDialog';

describe('CodeDialog Component', () => {
  const mockCode = 'const example = () => console.log("Hello World");';
  const mockLabel = 'Code Example';

  it('renders correctly with given props', () => {
    render(<CodeDialog code={mockCode} label={mockLabel} />);
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it('opens the dialog when the open button is clicked', () => {
    render(<CodeDialog code={mockCode} label={mockLabel} />);
    const openButton = screen.getByRole('button', {
      name: /code example/i,
    });
    fireEvent.click(openButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByText(mockCode)).toBeInTheDocument();
  });

  it.skip('closes the dialog when the close button is clicked', () => {
    render(<CodeDialog code={mockCode} label={mockLabel} />);
    const openButton = screen.getByRole('button', {
      name: /code example/i,
    });
    fireEvent.click(openButton); // Open dialog

    // Simulate pressing Escape to close the dialog
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    // Check that the dialog is not visible (instead of not in the DOM)
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toBeVisible();
  });

  it('renders code content correctly', () => {
    render(<CodeDialog code={mockCode} label={mockLabel} />);
    const openButton = screen.getByRole('button', {
      name: /code example/i,
    });
    fireEvent.click(openButton); // Open dialog

    const codeElement = screen.getByText(mockCode);
    expect(codeElement).toBeInTheDocument();
  });

  it('handles empty code gracefully', () => {
    render(<CodeDialog code="" label={mockLabel} />);
    const openButton = screen.getByRole('button', {
      name: /code example/i,
    });
    fireEvent.click(openButton); // Open dialog

    const codeElements = screen.queryAllByText('');
    const preElement = codeElements.find(el => el.tagName === 'PRE');
    expect(preElement).toBeInTheDocument();
  });
});
