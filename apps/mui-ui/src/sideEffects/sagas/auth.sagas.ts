import { call, delay, put, takeLatest } from 'redux-saga/effects';
import {
  FORCER_REFRESH_ACCESS_TOKEN,
  GET_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN,
  REVOKE_ACCESS_TOKEN,
} from '../actions/actionTypes';
import { AnyAction } from 'redux';
import { SagaIterator } from 'redux-saga';
import {
  clearSessionStorage,
  parseJwt,
  parseUserFromJwt,
  request,
  requestOptions,
  updateSessionStorage,
} from './utils';
import { AuthTokensResponse } from '../../types/api.types';
import {
  getAccessTokenError,
  refreshAccessToken as refreshAccessTokenAction,
  revokeAccessToken as revokeAccessTokenAction,
  refreshAccessTokenError,
} from '../actions/auth.actions';
import {
  FIVE_MINUTE_IN_MILLIS,
  secondsToMillis,
} from '../../utils/dateTime.utils';
import { clearUser, setUser } from '../actions/user.actions';
import { updateIdToken } from '../actions/app.actions';

const {
  REACT_APP_COGNITO_URL,
  REACT_APP_COGNITO_CLIENT_ID,
  REACT_APP_COGNITO_REDIRECT_URI,
} = process.env;

function* getAccessToken(action: AnyAction): SagaIterator {
  const { code } = action;

  const url = `${REACT_APP_COGNITO_URL}/oauth2/token?client_id=${REACT_APP_COGNITO_CLIENT_ID}&code=${code}&grant_type=authorization_code&redirect_uri=${REACT_APP_COGNITO_REDIRECT_URI}`;

  try {
    const response: AuthTokensResponse = yield call(
      request,
      url,
      requestOptions
    );

    const JWTObject = parseJwt(response.id_token);

    updateSessionStorage(response);
    yield put(setUser(parseUserFromJwt(JWTObject)));
    yield put(updateIdToken());
    yield put(refreshAccessTokenAction(response.refresh_token));
  } catch (err) {
    console.warn(err);
    yield put(getAccessTokenError(err as string));
    yield put(revokeAccessTokenAction());
  }
}

function* refreshAccessToken(action: AnyAction): SagaIterator {
  const { refreshToken } = action;
  const url = `${REACT_APP_COGNITO_URL}/oauth2/token?client_id=${REACT_APP_COGNITO_CLIENT_ID}&refresh_token=${refreshToken}&grant_type=refresh_token&code=${sessionStorage.getItem(
    'code'
  )}`;

  try {
    const idToken = sessionStorage.getItem('idToken');
    if (idToken) {
      const JWTObject = parseJwt(idToken);
      yield put(setUser(parseUserFromJwt(JWTObject)));
    }

    const expiresInSeconds = sessionStorage.getItem('expiresIn');
    if (expiresInSeconds) {
      yield delay(
        secondsToMillis(parseInt(expiresInSeconds)) - FIVE_MINUTE_IN_MILLIS
      );

      const response: AuthTokensResponse = yield call(
        request,
        url,
        requestOptions
      );

      const JWTObject = parseJwt(response.id_token);

      updateSessionStorage({ ...response, refresh_token: refreshToken });
      yield put(setUser(parseUserFromJwt(JWTObject)));
      yield put(updateIdToken());
      if (refreshToken) {
        yield put(refreshAccessTokenAction(refreshToken));
      }
    }
  } catch (err) {
    console.warn(err);
    yield put(refreshAccessTokenError(err as string));
    yield put(revokeAccessTokenAction());
  }
}

function* forceRefreshAccessToken(action: AnyAction): SagaIterator {
  const { refreshToken } = action;
  const url = `${REACT_APP_COGNITO_URL}/oauth2/token?client_id=${REACT_APP_COGNITO_CLIENT_ID}&refresh_token=${refreshToken}&grant_type=refresh_token&code=${sessionStorage.getItem(
    'code'
  )}`;

  try {
    const response: AuthTokensResponse = yield call(
      request,
      url,
      requestOptions
    );

    const JWTObject = parseJwt(response.id_token);

    updateSessionStorage({ ...response, refresh_token: refreshToken });
    yield put(setUser(parseUserFromJwt(JWTObject)));
    yield put(updateIdToken());
    if (refreshToken) {
      yield put(refreshAccessTokenAction(refreshToken));
    }
  } catch (err) {
    console.warn(err);
    yield put(refreshAccessTokenError(err as string));
    yield put(revokeAccessTokenAction());
  }
}

function* revokeAccessToken(): SagaIterator {
  clearSessionStorage();
  yield put(clearUser());
}

export const authSaga = function* authSaga() {
  yield takeLatest(GET_ACCESS_TOKEN, getAccessToken);
  yield takeLatest(REFRESH_ACCESS_TOKEN, refreshAccessToken);
  yield takeLatest(FORCER_REFRESH_ACCESS_TOKEN, forceRefreshAccessToken);
  yield takeLatest(REVOKE_ACCESS_TOKEN, revokeAccessToken);
};
