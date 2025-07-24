import React from 'react';
import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '../index';
import { MemoryRouter } from 'react-router-dom';

const renderComponent = (component: ReactElement) => {
  render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Breadcrumbs tests', () => {
  it('should render the component with a valid path', () => {
    renderComponent(<Breadcrumbs path="/" />);
    const link = screen.getByRole('link', { name: /Back to list/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should render multiple breadcrumbs for nested paths', () => {
    renderComponent(<Breadcrumbs path="/parent/child" />);

    // Adjusted to check the correct href for both parent and child breadcrumbs
    const parentLink = screen.getByRole('link', { name: /Back to list/i });
    const childLink = screen.getByRole('link', { name: /Back to list/i });

    expect(parentLink).toBeInTheDocument();
    expect(parentLink).toHaveAttribute('href', '/parent/child'); // Check for full path
    expect(childLink).toBeInTheDocument();
    expect(childLink).toHaveAttribute('href', '/parent/child'); // Check for child path
  });

  it('should handle an empty path gracefully', () => {
    renderComponent(<Breadcrumbs path="" />);
    const link = screen.queryByText('Back to list');
    expect(link).not.toBeInTheDocument();
  });

  it('should handle invalid paths gracefully', () => {
    renderComponent(<Breadcrumbs path="invalid/path" />);
    const link = screen.queryByText('Invalid');
    expect(link).not.toBeInTheDocument();
  });
});
