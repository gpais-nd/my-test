import { useEffect, useState } from 'react';

interface Size {
  windowHeight: number;
  windowWidth: number;
}

export const useResizeWindow = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
