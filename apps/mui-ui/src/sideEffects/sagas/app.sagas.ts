import { put, call, takeLatest } from 'redux-saga/effects';
import { getDataSources } from '../api';
import { APIDataSource, APIDataSourcesResponse } from 'types/api.types';
import { DataSource } from 'types/entities.types';
import { getDataSourceByName } from 'utils/datasources.utils';
import {
  FETCH_DATA_SOURCES,
  FETCH_DATA_SOURCES_FAILED,
  FETCH_DATA_SOURCES_SUCCESS,
} from '../actions/actionTypes';

const apiDataToDataSources = (
  apiDataSources: APIDataSource[]
): DataSource[] => {
  return apiDataSources
    ? apiDataSources.map(apiDataSource => {
        const parameters = getDataSourceByName(apiDataSource.name);
        return {
          ...apiDataSource,
          gridHeaders: parameters?.gridHeaders,
          attributesMap: parameters?.attributesMap,
        };
      })
    : [];
};

function* fetchDataSources() {
  try {
    const response: APIDataSourcesResponse = yield call(getDataSources);
    const apiDataSources = response.data.getDataSources;
    yield put({
      type: FETCH_DATA_SOURCES_SUCCESS,
      dataSources: apiDataToDataSources(apiDataSources),
    });
  } catch (e) {
    yield put({
      type: FETCH_DATA_SOURCES_FAILED,
      message: (e as Error).message,
    });
  }
}

export const appSaga = function* appSaga() {
  yield takeLatest(FETCH_DATA_SOURCES, fetchDataSources);
};
