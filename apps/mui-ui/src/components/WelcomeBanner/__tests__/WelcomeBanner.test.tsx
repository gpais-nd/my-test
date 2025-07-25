import { render, screen } from '@testing-library/react';
import { WelcomeBanner } from '../index';

describe('WelcomeBanner tests', () => {
  it('should render a default component', async () => {
    render(<WelcomeBanner />);

    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('Operational Metadata Store')).toBeInTheDocument();
  });
});
