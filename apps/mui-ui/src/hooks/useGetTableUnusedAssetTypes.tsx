import GreenCircle from '../assets/icons/GreenCircle';
import OrangeCircle from '../assets/icons/OrangeCircle';
import RedCircle from '../assets/icons/RedCircle';
import { TableUnusedAssetTypes } from '../types/entities.types';

export const useGetTableUnusedAssetTypes = (): TableUnusedAssetTypes => ({
  Red: {
    label: 'Red',
    icon: <RedCircle size="24" />,
  },
  Orange: {
    label: 'Orange',
    icon: <OrangeCircle size="24" />,
  },
  Normal: {
    label: 'Normal',
    icon: <GreenCircle size="24" />,
  },
});
