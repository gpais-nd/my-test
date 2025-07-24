export const isNumber = (value?: string | number | string[]): boolean => {
  if (Array.isArray(value)) {
    return false;
  }
  const isNotANumber = (x: unknown): boolean => isNaN(Number(x));
  return value ? typeof value === 'string' && !isNotANumber(value) : false;
};
