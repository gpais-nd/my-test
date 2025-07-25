import { useRef, useEffect, FC, ReactElement } from 'react';
import { Geometry } from '../GraphMap.types';
import SafariWrapper from '../VertexNode/SafariWrapper';
import { useSVGTracker } from '../../../hooks/useSvgCounter';

interface Props {
  id?: string;
  children: ReactElement;
  geometry: Geometry;
  dataTestId?: string;
}

const SVGObject: FC<Props> = ({
  id: providedId,
  children,
  geometry,
  dataTestId = 'foreignObject',
}) => {
  const { setObjects, generateId } = useSVGTracker();
  const isInitialMount = useRef(true);
  const idRef = useRef(providedId || generateId());
  const id = idRef.current;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setObjects((prev: any) => ({
        ...prev,
        [id]: { id, ...geometry },
      }));

      return () => {
        setObjects((prev: any) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      };
    }
  }, [id]);

  useEffect(() => {
    if (!isInitialMount.current) {
      setObjects((prev: any) => ({
        ...prev,
        [id]: { id, ...geometry },
      }));
    }
  }, [
    geometry.position.x,
    geometry.position.y,
    geometry.dimensions.width,
    geometry.dimensions.height,
  ]);

  return (
    <foreignObject
      x={geometry.position.x}
      y={geometry.position.y}
      height={geometry.dimensions.height}
      width={geometry.dimensions.width}
      data-testid={dataTestId}
    >
      <SafariWrapper>{children}</SafariWrapper>
    </foreignObject>
  );
};
SVGObject.displayName = 'SVGObject';
export default SVGObject;
