import { AnyAction } from 'redux';
import { CLEAR_USER, SET_USER } from '../actions/actionTypes';
import { User } from '../../types/user.types';

const initialState: User | undefined = {
  personalInfo: undefined,
  roles: [],
};

export function userReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        personalInfo: action.user.personalInfo,
        roles: action.user.roles,
      };
    case CLEAR_USER:
      return {
        ...state,
        personalInfo: initialState?.personalInfo,
        roles: initialState?.roles,
      };
    default:
      return state;
  }
}
