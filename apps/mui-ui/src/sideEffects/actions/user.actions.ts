import { AnyAction } from 'redux';
import { CLEAR_USER, SET_USER } from './actionTypes';
import { User } from '../../types/user.types';

export const setUser = (user: User): AnyAction => ({
  type: SET_USER,
  user,
});

export const clearUser = (): AnyAction => ({
  type: CLEAR_USER,
});
