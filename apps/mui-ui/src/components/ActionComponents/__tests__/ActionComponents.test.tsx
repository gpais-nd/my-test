import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ActionComponents } from '../index';
import { Button } from '../../Button';

describe('ActionComponents tests', () => {
  it('should render the component', async () => {
    render(<ActionComponents />);

    expect(screen.getByTestId('actionComponents')).toBeInTheDocument();
    expect(screen.getByTestId('actionComponents')).toBeEmptyDOMElement();
  });

  it('should render the component with one element', async () => {
    const actionElements: ReactElement[] = [<Button>Click me</Button>];
    render(<ActionComponents actionComponents={actionElements} />);

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });
});
