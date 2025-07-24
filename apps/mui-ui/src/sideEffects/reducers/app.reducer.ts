import { AnyAction } from 'redux';
import { ColumnSortDirection, DataSource } from 'types/entities.types';
import {
  FETCH_DATA_SOURCES_SUCCESS,
  SAVE_CURRENT_PAGE,
  SAVE_LIST_FILTERS,
  SAVE_LIST_SORTED_COLUMNS,
  UPDATE_GRAPH_MAP_GROUPS_FILTER,
  UPDATE_ID_TOKEN,
  UPDATE_DATADOG_TOKEN,
  UPDATE_HIGHLIGHTED,
  UPDATE_OPENED_NODE,
  UPDATE_CLOSED_NODE,
  SAVE_DATA_SELECTED_ASSET,
} from '../actions/actionTypes';
import { Filter } from '../../components/Grid/types';

export interface AppState {
  tokenUpdateCounter: number;
  datadogToken: string;
  selectedAsset: {
    dataSourceName: string;
    externalUrl: string;
    assetId: string;
  };
  gridPageStatus: {
    dataSourceName?: string;
    filters: Filter[];
    currentPage: number;
    sortedColumns: ColumnSortDirection[];
  };
  dataSources: DataSource[];
  graphMap: {
    groupsFilters: string[];
  };
  rootHighlighted?: boolean;
  openedNodeId: string;
  closedNodeId: string;
}

const initialState: AppState = {
  tokenUpdateCounter: 0,
  datadogToken: '',
  selectedAsset: {
    dataSourceName: '',
    externalUrl: '',
    assetId: '',
  },
  gridPageStatus: {
    dataSourceName: undefined,
    filters: [],
    currentPage: 1,
    sortedColumns: [],
  },
  dataSources: [],
  graphMap: {
    groupsFilters: [],
  },
  rootHighlighted: false,
  openedNodeId: '',
  closedNodeId: '',
};

export function appReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case UPDATE_ID_TOKEN:
      return {
        ...state,
        tokenUpdateCounter: state.tokenUpdateCounter + 1,
      };

    case UPDATE_DATADOG_TOKEN:
      return {
        ...state,
        datadogToken: action.datadogToken,
      };

    case FETCH_DATA_SOURCES_SUCCESS:
      return {
        ...state,
        dataSources: [...action.dataSources],
      };

    case SAVE_DATA_SELECTED_ASSET:
      return {
        ...state,
        selectedAsset: {
          dataSourceName: action.dataSourceName,
          externalUrl: action.externalUrl,
          assetId: action.assetId,
        },
      };

    case SAVE_LIST_FILTERS:
      return {
        ...state,
        gridPageStatus: {
          ...state.gridPageStatus,
          dataSourceName: action.dataSourceName,
          filters: [...action.filters],
        },
      };

    case SAVE_LIST_SORTED_COLUMNS:
      return {
        ...state,
        gridPageStatus: {
          ...state.gridPageStatus,
          sortedColumns: [...action.sortedColumns],
        },
      };

    case SAVE_CURRENT_PAGE:
      return {
        ...state,
        gridPageStatus: {
          ...state.gridPageStatus,
          currentPage: action.currentPage,
        },
      };

    case UPDATE_HIGHLIGHTED:
      return {
        ...state,
        rootHighlighted: action.rootHighlighted,
      };

    case UPDATE_GRAPH_MAP_GROUPS_FILTER:
      return {
        ...state,
        graphMap: {
          groupsFilters: [...action.groupsFilter],
        },
      };

    case UPDATE_OPENED_NODE:
      return {
        ...state,
        openedNodeId: action.openedNodeId,
      };

    case UPDATE_CLOSED_NODE:
      return {
        ...state,
        closedNodeId: action.closedNodeId,
      };

    default:
      return state;
  }
}
