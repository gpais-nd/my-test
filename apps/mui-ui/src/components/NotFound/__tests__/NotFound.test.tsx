import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../index';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

const renderComponent = (component: ReactElement) => {
  render(
    <MockedProvider>
      <MemoryRouter>{component}</MemoryRouter>
    </MockedProvider>
  );
};

describe('NotFound tests', () => {
  it('should render a default component', async () => {
    renderComponent(<NotFound />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to Metastore' })
    ).toBeInTheDocument();
  });
});
