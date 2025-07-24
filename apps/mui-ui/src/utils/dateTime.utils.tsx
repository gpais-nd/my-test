import { isNumber } from './number.utils';

export const MINUTE_IN_MILLIS = 60 * 1000;
export const FIVE_MINUTE_IN_MILLIS = 5 * MINUTE_IN_MILLIS;
export const HOUR_IN_MILLIS = 60 * MINUTE_IN_MILLIS;
export const DAY_IN_MILLIS = 24 * HOUR_IN_MILLIS;

// TODO: Implement for more age types
type AgeType = 'millis' | 'days';

export const secondsToMillis = (seconds: number): number => seconds * 1000;

export const stringToDate = (stringDate: string): Date =>
  new Date(Date.parse(stringDate));

export const epochToDate = (epoch: number): Date => new Date(epoch);

export const epochToDateString = (epoch: number): string =>
  epochToDate(epoch).toISOString();

export const getDateDiffInMillis = (dateIni: Date, dateEnd: Date): number =>
  dateEnd.getTime() - dateIni.getTime();

export const millisToDays = (millis: number): number =>
  millis / (1000 * 60 * 60 * 24);

export const getDateAge = (
  date?: string | number | Date | string | string[],
  ageType: AgeType = 'days'
): number | string => {
  if (!date || Array.isArray(date)) {
    return '';
  }

  const today = new Date();
  const dateIni: Date =
    typeof date === 'string' && !isNumber(date)
      ? stringToDate(date)
      : typeof date === 'string' && isNumber(date)
      ? epochToDate(parseInt(date))
      : (date as Date);

  if (ageType === 'millis') {
    return getDateDiffInMillis(dateIni, today);
  } else {
    return Math.floor(millisToDays(getDateDiffInMillis(dateIni, today)));
  }
};

export const extractDateTimeAsString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`;
};
