import { ToastVariant } from '../components/ToastMessages/types';
import { Dispatch } from 'redux';
import { addToastMessage } from '../sideEffects/actions/gui.actions';
import { QueryTypeEnum, RelationTypeEnum } from './lineage.utils';

const getPropertyByDotNotationIndex = <T,>(
  entity: T,
  dotNotationIndex: string
): unknown => {
  try {
    return (
      dotNotationIndex
        .split('.')
        // @ts-ignore
        .reduce((acc, key) => acc[key as keyof T], entity)
    );
  } catch (_) {
    return undefined;
  }
};

type PropertyByDotNotationIndexType = <T>(
  entity: T,
  dotNotationIndex: string
) => unknown;

export const getByDot: PropertyByDotNotationIndexType =
  getPropertyByDotNotationIndex;

export const uniqueId = (length = 16) => {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '')
  );
};

export const toastMessage = (
  dispatch: Dispatch,
  content: string,
  variant: ToastVariant = 'success',
  timeout = 5000
): void => {
  dispatch(
    addToastMessage({
      content,
      variant,
      timeout,
    })
  );
};

export const isSafariBrowser = (): boolean => {
  const userAgent = window.navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  return isSafari;
};

const removeSnowflakeLastPart = (assetId: string) => {
  const lastPeriodIndex = assetId.lastIndexOf('.');
  if (lastPeriodIndex === -1) {
    return assetId;
  }
  return assetId.substring(0, lastPeriodIndex);
};

export const getCorrectedAssetId = (
  assetId: string,
  dataSourceName: string,
  queryType: QueryTypeEnum,
  relationType: RelationTypeEnum
) => {
  return assetId.split('.').length === 6 &&
    dataSourceName === 'Snowflake' &&
    queryType === QueryTypeEnum.TABLE &&
    relationType === RelationTypeEnum.DOWNSTREAM
    ? removeSnowflakeLastPart(assetId)
    : assetId;
};
