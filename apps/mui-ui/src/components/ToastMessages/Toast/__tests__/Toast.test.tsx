import { render, screen } from '@testing-library/react';
import { Toast } from '../index';
import { ToastMessage } from 'components/ToastMessages/types';
import userEvent from '@testing-library/user-event';

describe('Toast tests', () => {
  it('should render the component', () => {
    const toastMessage: ToastMessage = {
      id: 12345,
      content: 'Hello toast',
      variant: 'info',
    };

    render(<Toast toastMessage={toastMessage} onClose={jest.fn()} />);

    expect(screen.getByText('Hello toast'));
  });

  it('should close the component on click the button', async () => {
    const onClose = jest.fn();
    const toastMessage: ToastMessage = {
      id: 12345,
      content: 'Hello toast',
      variant: 'info',
    };

    render(<Toast toastMessage={toastMessage} onClose={onClose} />);

    const button = screen.getByTestId('toastCloseButton');
    await userEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should hide the close button if timeout is passed', async () => {
    const toastMessage: ToastMessage = {
      id: 12345,
      content: 'Hello toast',
      variant: 'info',
      timeout: 2000,
    };

    render(<Toast toastMessage={toastMessage} onClose={jest.fn()} />);

    expect(screen.queryByTestId('toastCloseButton')).not.toBeInTheDocument();
  });
});
