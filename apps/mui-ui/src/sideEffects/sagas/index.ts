import { all } from 'redux-saga/effects';
import { appSaga } from './app.sagas';
import { authSaga } from './auth.sagas';

export function* rootSaga() {
  yield all([appSaga(), authSaga()]);
}
