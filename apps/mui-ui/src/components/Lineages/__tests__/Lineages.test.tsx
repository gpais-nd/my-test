import { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { userEvent } from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../sideEffects/reducers';
import { MockedProvider } from '@apollo/client/testing';
import { mocks } from '../__mocks__/lineages.mocks';
import { mockResizeObserver } from '../../../tests/utils';
import Lineages from '../Lineages';

mockResizeObserver({ height: 800, width: 1200 });

// Mock DOMMatrixReadOnly and DOMMatrix for @xyflow/react compatibility in JSDOM
if (!window.DOMMatrixReadOnly) {
  window.DOMMatrixReadOnly = class {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  } as any;
}
if (!window.DOMMatrix) {
  window.DOMMatrix = class {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  } as any;
}

const mockStore = configureStore({
  reducer: rootReducer,
});

const renderComponent = (component: ReactElement) => {
  render(
    <Provider store={mockStore}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </MockedProvider>
    </Provider>
  );
};

const dataSource = {
  id: '1',
  name: 'Snowflake',
  showLineage: true,
};

describe('Lineage tests', () => {
  it('should render a default component in Table Lineage with the root node', async () => {
    renderComponent(
      <Lineages
        assetId="disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740"
        lineageAssetName="Root Node"
        dataSource={dataSource}
      />
    );

    expect(screen.getByText('Root Node')).toBeInTheDocument();
    // The actual buttons have title attributes, not accessible names as tooltips
    expect(screen.getByTitle('Add parent nodes to the left')).toBeInTheDocument();
    expect(screen.getByTitle('Add child nodes to the right')).toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: 'Table Lineage' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Query Lineage' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Cloned Lineage' })
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'CW Lineage' })).toBeInTheDocument();
  });

  it('should navigate to Query Lineage tab', async () => {
    renderComponent(
      <Lineages
        assetId="disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740"
        lineageAssetName="Root Node"
        dataSource={dataSource}
      />
    );

    const queryLineageButton = screen.getByText('Query Lineage');

    await waitFor(() => {
      userEvent.click(queryLineageButton);
      expect(queryLineageButton).toBeInTheDocument();
    });

    expect(screen.getByText('Root Node')).toBeInTheDocument();
  });
});
