export const capitalizeFirstLetter = (string: string): string => {
  const lowerCase = string.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
};

const containsBrackets = (input: string): boolean => {
  const regex = /\[[^\]]+\]/;
  return regex.test(input);
};

export const removeBracketsVariables = (input: string): string => {
  if (containsBrackets(input)) {
    return input.replace(/\[.*?\]/g, '').replace(/\./g, '');
  } else {
    return input;
  }
};
