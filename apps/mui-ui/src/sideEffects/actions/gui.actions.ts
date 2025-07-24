import { AnyAction } from 'redux';
import {
  ADD_TOAST_MESSAGE,
  CLEAR_TOAST_MESSAGES,
  REMOVE_TOAST_MESSAGE,
} from './actionTypes';
import { ToastMessage } from 'components/ToastMessages/types';
import { uniqueId } from '../../utils';

export const addToastMessage = (toastMessage: ToastMessage): AnyAction => ({
  type: ADD_TOAST_MESSAGE,
  toastMessage: {
    ...toastMessage,
    id: uniqueId(),
  },
});

export const removeToastMessage = (toastMessageId: number): AnyAction => ({
  type: REMOVE_TOAST_MESSAGE,
  toastMessageId,
});

export const clearToastMessages = (): AnyAction => ({
  type: CLEAR_TOAST_MESSAGES,
});
