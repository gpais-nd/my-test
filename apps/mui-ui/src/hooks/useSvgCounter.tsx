import { Point, Dimensions } from 'components/GraphMap/GraphMap.types';
import React, { createContext, useContext, useState, useRef } from 'react';

interface SVGObjectData {
  id: string;
  position: Point;
  dimensions: Dimensions;
}

export type ObjectsMap = Record<string, SVGObjectData>;

interface SVGContextType {
  objects: ObjectsMap;
  setObjects: React.Dispatch<React.SetStateAction<ObjectsMap>>;
  generateId: () => string;
}

const SVGContext = createContext<SVGContextType | undefined>(undefined);

export const SVGContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [objects, setObjects] = useState<ObjectsMap>({});
  const idCounter = useRef(0);

  const generateId = () => {
    idCounter.current += 1;
    return `svg-object-${idCounter.current}`;
  };

  const value = React.useMemo(
    () => ({
      objects,
      setObjects,
      generateId,
    }),
    [objects]
  );

  return <SVGContext.Provider value={value}>{children}</SVGContext.Provider>;
};

export const useSVGTracker = () => {
  const context = useContext(SVGContext);
  if (!context) {
    throw new Error('useSVGTracker must be used within SVGContextProvider');
  }
  return context;
};
