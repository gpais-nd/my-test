import { render, screen } from '@testing-library/react';
import { WelcomeBanner } from '../index';

describe('WelcomeBanner tests', () => {
  it('should render a default component', async () => {
    render(<WelcomeBanner />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(
      screen.getByText('Find tables in the Data Sources folders.')
    ).toBeInTheDocument();
  });
});
