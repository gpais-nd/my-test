import { render, screen } from '@testing-library/react';
import DownloadDialog from '../DownloadDialog';

describe('DownloadDialog tests', () => {
  it('should render the component in default mode', async () => {
    render(
      <DownloadDialog
        isOpen
        assetId="disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740"
        assetType="TABLE"
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(
      screen.getByRole('dialog', { name: 'Table Lineage Report' })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Asset' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Asset' })).toBeDisabled();
    // Check for the submit button
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
