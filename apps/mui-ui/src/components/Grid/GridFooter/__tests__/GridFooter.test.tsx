import { render, screen } from '@testing-library/react';
import { GridFooter } from '../index';

describe('GridFooter tests', () => {
  it('should render an empty footer', async () => {
    const { container } = render(<GridFooter></GridFooter>);

    expect(container).toHaveTextContent('');
  });

  it('should render a footer with custom content', async () => {
    render(
      <GridFooter>
        <button>Click me</button>
      </GridFooter>
    );

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });
});
