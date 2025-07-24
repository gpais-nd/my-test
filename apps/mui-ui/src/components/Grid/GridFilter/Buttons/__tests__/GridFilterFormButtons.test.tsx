import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GridFilterFormButtons from '../GridFilterFormButtons';

describe('GridFilterFormButtons tests', () => {
  it('should render a default component', async () => {
    const onApply = jest.fn();
    const onClear = jest.fn();

    render(<GridFilterFormButtons onApply={onApply} onClear={onClear} />);

    const applyButton = screen.getByRole('button', { name: 'Apply filters' });
    const clearButton = screen.getByRole('button', { name: 'Clear filters' });

    await userEvent.click(applyButton);
    expect(onApply).toHaveBeenCalledTimes(1);

    await userEvent.click(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
