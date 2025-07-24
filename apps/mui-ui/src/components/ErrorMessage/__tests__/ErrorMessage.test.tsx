import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../index';

describe('ErrorMessage tests', () => {
  it('should render ErrorMessage component with custom text', async () => {
    render(<ErrorMessage text="Custom error message" />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should handle rendering with no text gracefully', async () => {
    render(<ErrorMessage text="" />);
    const errorElement = screen.queryByText('');
    expect(errorElement).not.toBeInTheDocument();
  });

  it('should support additional props', async () => {
    render(
      <ErrorMessage text="Custom error message" data-testid="error-message" />
    );
    const errorElement = screen.getByTestId('error-message');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Custom error message');
  });

  it('should support accessibility attributes', async () => {
    render(
      <ErrorMessage
        text="Accessible error message"
        aria-label="Error Message"
      />
    );
    const errorElement = screen.getByLabelText('Error Message');
    expect(errorElement).toBeInTheDocument();
  });
});
