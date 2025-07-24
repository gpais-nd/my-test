import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (component: ReactElement) => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Provider store={mockStore}>{component}</Provider>
    </MemoryRouter>
  );
};

describe('App tests', () => {
  it('should show the app component with default options', async () => {
    renderComponent(<App />);

    expect(screen.getByTestId('toastMessages')).toBeInTheDocument();
  });
});
