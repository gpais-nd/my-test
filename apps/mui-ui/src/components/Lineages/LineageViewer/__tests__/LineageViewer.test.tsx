import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import LineageViewer from '../LineageViewer';
import { MockedProvider } from '@apollo/client/testing';
import { mockResizeObserver } from '../../../../tests/utils';
import { mocks } from '../../__tests__/lineages.mocks';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { QueryTypeEnum } from 'utils/lineage.utils';

mockResizeObserver({ height: 800, width: 1200 });

const renderComponent = (component: ReactElement) => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {component}
    </MockedProvider>
  );
};

describe('LineageViewer tests', () => {
  it('should render the component with the default vertex', async () => {
    renderComponent(
      <LineageViewer
        assetId={'assetId123'}
        assetName={'Asset Name'}
        queryType={QueryTypeEnum.TABLE}
        title="Table Lineage"
        dataSource="DeltaLake"
      />
    );

    const rootVertex = await screen.findByText('Asset Name');

    expect(rootVertex).toBeInTheDocument();
  });

  it('should call the downstream query and show the vertices in the viewer', async () => {
    const assetId =
      'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740';
    const expectedDownstreamId =
      'disneystreaming.aws_us_east_1.dss_prod.disney_plus.dim_daily_account_engagement.16093252';
    const expectedDownstreamName =
      'dss_prod.disney_plus.dim_daily_account_engagement.16093252';

    renderComponent(
      <LineageViewer
        assetId={assetId}
        assetName={'global_segmentation_all_dplus_subs_2024_01_20_population'}
        queryType={QueryTypeEnum.TABLE}
        title="Table Lineage"
        dataSource="DeltaLake"
      />
    );

    const downstreamButton = screen.getByRole('button', {
      name: 'Show downstream',
    });

    await act(async () => await userEvent.click(downstreamButton));
    const newDownstream = screen.getByText(expectedDownstreamName);
    expect(newDownstream).toBeInTheDocument();
    expect(
      screen.getByTestId(`${assetId}_${expectedDownstreamId}`)
    ).toBeInTheDocument();

    await act(async () => await userEvent.click(downstreamButton));
    const hiddenDownstream = screen.queryByText(expectedDownstreamName);
    expect(hiddenDownstream).not.toBeInTheDocument();
  });

  it('should call the upstream query and show the vertices in the viewer', async () => {
    const assetId =
      'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740';

    renderComponent(
      <LineageViewer
        assetId={assetId}
        assetName={'global_segmentation_all_dplus_subs_2024_01_20_population'}
        queryType={QueryTypeEnum.TABLE}
        title="Table Lineage"
        dataSource="DeltaLake"
      />
    );

    const downstreamButton = screen.getByRole('button', {
      name: 'Show upstream',
    });

    await act(async () => await userEvent.click(downstreamButton));
    const upstreamVertices = screen.getAllByTestId('vertex_node');
    expect(upstreamVertices).toHaveLength(16);

    await act(async () => await userEvent.click(downstreamButton));
    const hiddenUpstreamVertices = screen.queryAllByTestId('vertex_node');
    expect(hiddenUpstreamVertices).toHaveLength(1);
  });
});
