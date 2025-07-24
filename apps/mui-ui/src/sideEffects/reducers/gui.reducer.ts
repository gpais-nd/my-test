import { ToastMessage } from 'components/ToastMessages/types';
import { AnyAction } from 'redux';
import {
  ADD_TOAST_MESSAGE,
  CLEAR_TOAST_MESSAGES,
  REMOVE_TOAST_MESSAGE,
} from '../actions/actionTypes';

export interface GuiState {
  toastMessages: ToastMessage[];
}

const initialState: GuiState = {
  toastMessages: [],
};

export function guiReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case ADD_TOAST_MESSAGE:
      return {
        ...state,
        toastMessages: [...state.toastMessages, action.toastMessage],
      };

    case REMOVE_TOAST_MESSAGE:
      return {
        ...state,
        toastMessages: state.toastMessages.reduce<ToastMessage[]>(
          (acc, toastMessage) => {
            return toastMessage.id === action.toastMessageId
              ? [...acc]
              : [...acc, toastMessage];
          },
          []
        ),
      };

    case CLEAR_TOAST_MESSAGES:
      return {
        ...state,
        toastMessages: [],
      };

    default:
      return state;
  }
}
