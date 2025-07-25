
import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TableDetails from '../index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  // This path matches the expected pattern in TableDetails
  const initialPath = '/dataSource/DeltaLake/database/dataeng_qa/asset/s3%3A%2F%2Fdataeng-data-test%2Fqa%2Fdata%2Factivation_services%2Fv1%2Freceipt_audit';
  render(
    <Provider store={mockStore}>
      <MockedProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route
              path="/dataSource/:dataSource/database/:databaseName/asset/:tableId"
              element={<TableDetails />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Provider>
  );
};

describe('TableDetails component', () => {
  it('should show the component', async () => {
    renderComponent();
    expect(screen.getByText('Loading Table Details')).toBeInTheDocument();
  });
});
