
import React from 'react';
import { render } from '@testing-library/react';
import SVGObject from '../SVGObject';
import { SVGContextProvider } from '../../../../hooks/useSvgCounter';

const mockGeometry = {
  position: { x: 0, y: 0 },
  dimensions: { width: 10, height: 10 },
};

describe('SVGObject', () => {
  it('renders without crashing', () => {
    render(
      <SVGContextProvider>
        <SVGObject geometry={mockGeometry}>
          <div>Child</div>
        </SVGObject>
      </SVGContextProvider>
    );
  });
});
