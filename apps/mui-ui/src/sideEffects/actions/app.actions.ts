import { AnyAction } from 'redux';
import {
  FETCH_DATA_SOURCES,
  UPDATE_ID_TOKEN,
  SAVE_LIST_FILTERS,
  SAVE_LIST_SORTED_COLUMNS,
  UPDATE_GRAPH_MAP_GROUPS_FILTER,
  UPDATE_HIGHLIGHTED,
  SAVE_DATA_SELECTED_ASSET,
} from './actionTypes';
import { Filter } from '../../components/Grid/types';
import { ColumnSortDirection } from '../../types/entities.types';

export const updateIdToken = (): AnyAction => ({
  type: UPDATE_ID_TOKEN,
});

export const fetchDataSources = (): AnyAction => ({
  type: FETCH_DATA_SOURCES,
});

export const saveListFilters = (
  dataSourceName: string,
  filters: Filter[]
): AnyAction => ({
  type: SAVE_LIST_FILTERS,
  dataSourceName,
  filters,
});

export const saveDataSelectedAsset = (
  dataSourceName: string,
  externalUrl: string,
  assetId: string
): AnyAction => ({
  type: SAVE_DATA_SELECTED_ASSET,
  dataSourceName,
  externalUrl,
  assetId,
});

export const saveListSortedColumns = (
  sortedColumns: ColumnSortDirection[]
): AnyAction => ({
  type: SAVE_LIST_SORTED_COLUMNS,
  sortedColumns,
});

export const updateGraphMapGroupsFilter = (
  groupsFilter: string[]
): AnyAction => ({
  type: UPDATE_GRAPH_MAP_GROUPS_FILTER,
  groupsFilter,
});

export const updateHighlighted = (rootHighlighted: boolean): AnyAction => ({
  type: UPDATE_HIGHLIGHTED,
  rootHighlighted,
});
