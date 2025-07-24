import { useState } from 'react';

interface Props {
  millisToWait?: number;
}

interface DebounceUtils {
  debounce: (text: string) => Promise<string>;
}

export const useDebounce = ({ millisToWait = 1000 }: Props): DebounceUtils => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const debounce = (text: string): Promise<string> => {
    clearTimeout(timer);
    return new Promise<string>(resolve => {
      setTimer(
        setTimeout(() => {
          resolve(text);
        }, millisToWait)
      );
    });
  };

  return {
    debounce,
  };
};
