import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import AuthenticatedRoutes from '../AuthenticatedRoutes';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (component: ReactElement) => {
  render(
    <MockedProvider>
      <MemoryRouter>
        <Provider store={mockStore}>{component}</Provider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe('AuthenticatedRoutes tests', () => {
  it('should render a default component', async () => {
    renderComponent(<AuthenticatedRoutes />);

    screen.debug();
  });
});
