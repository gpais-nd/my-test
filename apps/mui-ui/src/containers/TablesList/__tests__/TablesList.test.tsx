import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import TablesList from '../index';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (component: ReactElement) => {
  return render(
    <MockedProvider>
      <MemoryRouter>
        <Provider store={mockStore}>{component}</Provider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe('TablesList tests', () => {
  it('should render an empty table list', async () => {
    renderComponent(<TablesList />);

    expect(screen.queryByText('Loading Table Details')).not.toBeInTheDocument();
  });
});
