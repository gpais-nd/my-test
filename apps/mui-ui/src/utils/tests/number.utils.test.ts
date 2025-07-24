import { isNumber } from '../number.utils';

describe('Test cases for number utils', () => {
  it('should validate if something is a number or not', () => {
    expect(isNumber('3')).toEqual(true);
    expect(isNumber(undefined)).toEqual(false);
    expect(isNumber('Hello')).toEqual(false);
  });
});
