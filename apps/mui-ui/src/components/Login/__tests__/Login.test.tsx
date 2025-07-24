import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../Login';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

const renderComponent = (component: ReactElement) => {
  render(
    <MockedProvider>
      <MemoryRouter>{component}</MemoryRouter>
    </MockedProvider>
  );
};

describe('Login tests', () => {
  it('should render a default component', async () => {
    renderComponent(<Login />);

    expect(screen.getByText('Welcome to Metastore')).toBeInTheDocument();
    expect(screen.getByText('Please click to continue.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
