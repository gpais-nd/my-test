import { getDataSourceByName } from 'utils/datasources.utils';

export const getCustomQueryForListPage = (dataSourceName: string): string => {
  if (dataSourceName) {
    return getDataSourceByName(dataSourceName)?.customQueryForListPage ?? '';
  } else {
    return '';
  }
};

export const getCustomQueryForDetailsPage = (
  dataSourceName: string
): string => {
  if (dataSourceName) {
    return getDataSourceByName(dataSourceName)?.customQueryForDetailsPage ?? '';
  } else {
    return '';
  }
};
