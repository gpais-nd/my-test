import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../index';

describe('Button tests', () => {
  it('should render the component', () => {
    render(<Button onClick={() => {}}>Click me</Button>);

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should trigger the click event', async () => {
    const onClickButton = jest.fn();
    render(<Button onClick={onClickButton}>Click me</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClickButton).toHaveBeenCalledTimes(1);
  });
});
