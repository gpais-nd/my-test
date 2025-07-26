import React from 'react';
import { render } from '@testing-library/react';
import LineageVertexContent from '../LineageVertexContent';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Minimal mock reducer for the required state
const mockReducer = (state = { app: { rootHighlighted: false } }) => state;
const store = configureStore({ reducer: mockReducer });

describe('LineageVertexContent', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <LineageVertexContent
          assetName="Asset"
          dataSourceName="DataSource"
          nodeType="Dataset"
        />
      </Provider>
    );
  });
});
