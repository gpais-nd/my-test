import { FC, ReactElement, useEffect } from 'react';
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch } from 'react-redux';
import { ToastMessages } from '../index';
import { rootReducer } from '../../../sideEffects/reducers';
import { ToastMessage } from 'components/ToastMessages/types';
import { addToastMessage } from '../../../sideEffects/actions/gui.actions';

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (
  component: ReactElement,
  toastMessages?: ToastMessage[]
) => {
  render(
    <Provider store={mockStore}>
      {component}
      {toastMessages && (
        <MockToastGeneratorComponent toastMessages={toastMessages} />
      )}
    </Provider>
  );
};

const MockToastGeneratorComponent: FC<{ toastMessages: ToastMessage[] }> = ({
  toastMessages,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    toastMessages.forEach(toastMessage =>
      dispatch(addToastMessage(toastMessage))
    );
  }, []);

  return null;
};

describe('ToastMessages tests', () => {
  it('should render the component', () => {
    renderComponent(<ToastMessages />);

    expect(screen.getByTestId('toastMessages')).toBeInTheDocument();
  });

  it('should show a toast message and close it on click in button', async () => {
    const toastMessage: ToastMessage = {
      id: 12345,
      content: 'Hello closable toast',
      variant: 'info',
    };

    renderComponent(<ToastMessages />, [toastMessage]);

    const message = await screen.findByText('Hello closable toast');
    const closeButton = screen.getByTestId('toastCloseButton');

    expect(message).toBeInTheDocument();

    await act(async () => await userEvent.click(closeButton));
    expect(screen.queryByText('Hello closable toast')).not.toBeInTheDocument();
  });

  it('should show a toast message and close it after 2 seconds', async () => {
    const toastMessage: ToastMessage = {
      id: 12346,
      content: 'Hello timeout toast',
      variant: 'info',
      timeout: 2000,
    };

    renderComponent(<ToastMessages />, [toastMessage]);

    const message = await screen.findByText('Hello timeout toast');
    expect(message).toBeInTheDocument();

    await waitForElementToBeRemoved(message, { timeout: 2100 });
    expect(message).not.toBeInTheDocument();
  });

  it('should add multiple timeout toasts and then should be empty', async () => {
    const toastMessage1: ToastMessage = {
      id: 12346,
      content: 'Hello timeout 1',
      variant: 'info',
      timeout: 100,
    };

    const toastMessage2: ToastMessage = {
      id: 12346,
      content: 'Hello timeout 2',
      variant: 'info',
      timeout: 80,
    };

    renderComponent(<ToastMessages />, [toastMessage1, toastMessage2]);

    const message1 = await screen.findByText('Hello timeout 1');
    const message2 = await screen.findByText('Hello timeout 2');
    expect(message1).toBeInTheDocument();
    expect(message2).toBeInTheDocument();

    await waitForElementToBeRemoved(message1, { timeout: 150 });

    expect(screen.getByTestId('toastMessages')).toBeEmptyDOMElement();
  });
});
