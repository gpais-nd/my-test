import { render, screen } from '@testing-library/react';
import { Loader } from '../index';

describe('Loader tests', () => {
  it('should render the loader component', async () => {
    render(<Loader />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render the loader component with a text specified', async () => {
    render(<Loader text="Loading..." />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
