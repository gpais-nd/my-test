import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button tests', () => {
  it('should render the component', () => {
    render(<Button>Hello button</Button>);

    expect(screen.getByText('Hello button')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hello button' })
    ).toBeInTheDocument();
  });

  it('should call function when clicked', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Accept</Button>);

    const button = screen.getByRole('button', { name: 'Accept' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call function when button is disabled', async () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Disabled' });
    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('should render with additional props', () => {
    render(<Button data-testid="custom-button">Custom Props</Button>);

    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Custom Props');
  });

  it('should handle rendering without children gracefully', () => {
    render(<Button />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  it('should support accessibility attributes', () => {
    render(<Button aria-label="Accessible Button">Accessible</Button>);

    const button = screen.getByLabelText('Accessible Button');
    expect(button).toBeInTheDocument();
  });
});
