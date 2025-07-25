import { render } from '@testing-library/react';
import Pipelines from '../Pipelines';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

const mockStore = configureStore({
    reducer: rootReducer,
});

describe('Pipelines', () => {
    it('should render without crashing', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <Provider store={mockStore}>
                        <Pipelines />
                    </Provider>
                </MockedProvider>
            </MemoryRouter>
        );
    });
});
