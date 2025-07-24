import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import TableDetails from '../index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (component: ReactElement) => {
  const encodedURL =
    '/ds/DeltaLake/db/dataeng_qa/t/s3%3A%2F%2Fdataeng-data-test%2Fqa%2Fdata%2Factivation_services%2Fv1%2Freceipt_audit';

  render(
    <Provider store={mockStore}>
      <MockedProvider>
        <MemoryRouter initialEntries={[encodedURL]}>
          {component}
          {/* <Routes initialEntries={[encodedURL]}>
            <Route
              path={'/ds/:dataSource/db/:databaseName/t/:tableId'}
              element={<TableDetails />}
            />
          </Routes> */}
        </MemoryRouter>
      </MockedProvider>
    </Provider>
  );
};

describe('TableDetails component', () => {
  it('should show the component', async () => {
    renderComponent(<TableDetails />);

    expect(screen.getByText('Loading Table Details')).toBeInTheDocument();
  });
});
