import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (component: ReactElement, path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Provider store={mockStore}>{component}</Provider>
    </MemoryRouter>
  );
};

describe('Header tests', () => {
  it('should show the header for the main page', async () => {
    renderComponent(<Header />, '/');

    expect(screen.getByTestId('pageHeader')).toHaveClass('primary');
  });

  it('should show the header for pages different than main page', async () => {
    renderComponent(<Header />, '/any-other-path');

    expect(screen.getByTestId('pageHeader')).toHaveClass('secondary');
  });
});
