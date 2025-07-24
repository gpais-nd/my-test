import { AnyAction } from 'redux';
import {
  FORCER_REFRESH_ACCESS_TOKEN,
  GET_ACCESS_TOKEN,
  GET_ACCESS_TOKEN_ERROR,
  REFRESH_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN_ERROR,
  REVOKE_ACCESS_TOKEN,
} from './actionTypes';

export const getAccessToken = (code: string): AnyAction => ({
  type: GET_ACCESS_TOKEN,
  code,
});

export const getAccessTokenError = (errorCode: string): AnyAction => ({
  type: GET_ACCESS_TOKEN_ERROR,
  errorCode,
});

export const refreshAccessToken = (refreshToken: string): AnyAction => ({
  type: REFRESH_ACCESS_TOKEN,
  refreshToken,
});

export const forceRefreshAccessToken = (refreshToken: string): AnyAction => ({
  type: FORCER_REFRESH_ACCESS_TOKEN,
  refreshToken,
});

export const refreshAccessTokenError = (errorCode: string): AnyAction => ({
  type: REFRESH_ACCESS_TOKEN_ERROR,
  errorCode,
});

export const revokeAccessToken = (): AnyAction => ({
  type: REVOKE_ACCESS_TOKEN,
});
