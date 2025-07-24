import TableLayerIconBronze from 'assets/icons/TableLayerIconBronze';
import TableLayerIconGold from 'assets/icons/TableLayerIconGold';
import TableLayerIconSilver from 'assets/icons/TableLayerIconSilver';
import { TableLayerTypes } from 'types/entities.types';

export const useGetTableLayerTypes = (): TableLayerTypes => ({
  gold: {
    label: 'Gold',
    icon: <TableLayerIconGold />,
  },
  silver: {
    label: 'Silver',
    icon: <TableLayerIconSilver />,
  },
  bronze: {
    label: 'Bronze',
    icon: <TableLayerIconBronze />,
  },
});
