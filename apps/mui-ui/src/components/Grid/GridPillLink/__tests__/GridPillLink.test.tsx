import { render, screen } from '@testing-library/react';
import { GridPillLink } from '../index';

describe('GridPillLink tests', () => {
  it('should render a pill link', async () => {
    render(<GridPillLink label="Go to" url="https://example.com" />);

    expect(screen.getByRole('link', { name: 'Go to' })).toBeInTheDocument();
  });
});
