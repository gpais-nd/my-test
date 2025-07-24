import { CSSSizeValue } from 'types/utils.types';
import { CountingOption, Option } from '../Form/types';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';
import { ReactElement } from 'react';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE',
}

type FilterType = 'fixed' | 'text' | 'aggregation' | 'options';

export interface Filter {
  type: FilterType;
  remoteSearchFields: string[];
  headerName?: string;
  selectedValue?: string | CountingOption;
  aggregationName?: string;
  options?: CountingOption[] | Option[];
  hidden?: boolean;
  filterSelectProps?: StateManagerProps;
  customQuery?: {
    operator:
      | 'equals'
      | 'not_equals'
      | 'in'
      | 'not_in'
      | 'exists'
      | 'not_exists'
      | 'like'
      | 'ilike'
      | 'not_like'
      | 'not ilike';
    key: string;
  };
}
export interface GridColumnHeader {
  name: string;
  label: string | ReactElement;
  sortable?: boolean;
  sortDirection?: SortDirection;
  remoteSortField?: string;
  defaultSortBy?: string;
  defaultSortType?: SortDirection;
  className?: string;
  width?: CSSSizeValue;
  filter?: Filter;
}

export interface GenericGridRow {
  id: string;
  collapsibleContent?: ReactElement;
}
