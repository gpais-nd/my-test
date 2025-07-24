import {
  epochToDate,
  epochToDateString,
  secondsToMillis,
  stringToDate,
} from '../dateTime.utils';

describe('Test cases for date time utils', () => {
  describe('milliseconds transforms', () => {
    it('should convert seconds to milliseconds', () => {
      expect(secondsToMillis(100)).toEqual(100000);
      expect(secondsToMillis(0)).toEqual(0);
      expect(secondsToMillis(-100)).toEqual(-100000);
    });
  });

  describe('date time transforms', () => {
    it('should get NaN when an empty date is passed', () => {
      const date = stringToDate('');
      expect(date.getFullYear()).toEqual(NaN);
      expect(date.getMonth()).toEqual(NaN);
      expect(date.getDate()).toEqual(NaN);
    });

    it('should get NaN when an wrong string is passed', () => {
      const date = stringToDate('wrong string');
      expect(date.getFullYear()).toEqual(NaN);
      expect(date.getMonth()).toEqual(NaN);
      expect(date.getDate()).toEqual(NaN);
    });

    it('should convert a string to a date', () => {
      const date = stringToDate('2023-11-11 03:03:03');
      expect(date.getFullYear()).toEqual(2023);
      expect(date.getMonth()).toEqual(10);
      expect(date.getDate()).toEqual(11);
    });
  });

  describe('epoch transforms', () => {
    it('should convert the first unit epoch to date', () => {
      const date = epochToDate(0);
      expect(date.getFullYear()).toEqual(1969);
      expect(date.getMonth()).toEqual(11);
      expect(date.getDate()).toEqual(31);
    });

    it('should convert a epoch to a date', () => {
      const date = epochToDate(1700775527000);
      expect(date.getFullYear()).toEqual(2023);
      expect(date.getMonth()).toEqual(10);
      expect(date.getDate()).toEqual(23);
    });

    it('should convert a epoch to a date string', () => {
      const date = epochToDateString(1700775527000);
      expect(date).toEqual('2023-11-23T21:38:47.000Z');
    });
  });
});
