jest.mock('config/TableauWidgets.config', () => ({
  TableauWidgetsConfig: {},
}));
jest.mock('config/TableauDataset.config', () => ({
  TableauDatasetConfig: {},
}));
jest.mock('config/TableauDashboard.config', () => ({
  TableauDashboardConfig: {},
}));

import { render, screen } from '@testing-library/react';
import { getAssetFromListByAssetId } from '../../__tests__/asset.mock';
import { AssetRowCustomLayer } from '../AssetRowCustomComponents';

describe('AssetRowValueElement tests', () => {
  describe('AssetRowCustomLayer', () => {
    it('should render the Layer as gold for DeltaLake asset', () => {
      const asset = getAssetFromListByAssetId(
        'DeltaLake',
        's3://dataeng-data-test/qa/data/content_metadata/stitch/v1/content_event_metadata_language_r'
      );
      render(<AssetRowCustomLayer asset={asset} />);
      const layerLink = screen.getByRole('link', { name: 'layer-gold-svg' });
      expect(layerLink).toHaveAttribute(
        'href',
        'https://github.bamtech.co/pages/data-eng/metastore/layers/'
      );
    });

    it('should render the Layer as silver for DeltaLake asset', () => {
      const asset = getAssetFromListByAssetId(
        'DeltaLake',
        's3://dataeng-data-test/qa/data/activation_services/v1/receipt_audit'
      );
      render(<AssetRowCustomLayer asset={asset} />);
      const layerLink = screen.getByRole('link', { name: 'layer-silver-svg' });
      expect(layerLink).toHaveAttribute(
        'href',
        'https://github.bamtech.co/pages/data-eng/metastore/layers/'
      );
    });

    it('should render the Layer as bronze for DeltaLake asset', () => {
      const asset = getAssetFromListByAssetId(
        'DeltaLake',
        's3://dataeng-data-test/qa/data/content_metadata/series'
      );
      render(<AssetRowCustomLayer asset={asset} />);
      const layerLink = screen.getByRole('link', { name: 'layer-bronze-svg' });
      expect(layerLink).toHaveAttribute(
        'href',
        'https://github.bamtech.co/pages/data-eng/metastore/layers/'
      );
    });

    it('should handle invalid asset type gracefully', () => {
      const asset = getAssetFromListByAssetId('InvalidType', 'invalid/path');
      render(<AssetRowCustomLayer asset={asset} />);
      const layerLink = screen.queryByRole('link');
      expect(layerLink).not.toBeInTheDocument();
    });
  });
});
