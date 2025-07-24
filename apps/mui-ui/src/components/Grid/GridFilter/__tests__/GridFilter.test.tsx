import { render, screen } from '@testing-library/react';
import { GridFilter } from '../index';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('GridFilter tests', () => {
  it('should render a default component', async () => {
    render(
      <GridFilter>
        <div>Mock message</div>
      </GridFilter>
    );

    const toggleButton = screen.getByRole('button', {
      name: 'Grid Toggle Filter Button',
    });

    await act(async () => await userEvent.click(toggleButton));

    expect(screen.getByText('Mock message'));
    expect(
      screen.getByRole('button', { name: 'Apply filters' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Clear filters' })
    ).toBeInTheDocument();
  });
});
