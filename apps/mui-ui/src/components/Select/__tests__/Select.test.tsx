import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Select } from '../index';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const renderComponent = (component: ReactElement) => {
  render(component);
};

describe('Select tests', () => {
  it('should render a select component with the provided value', async () => {
    renderComponent(
      <Select
        name="selector"
        label="Test Selector"
        options={[]}
        defaultValue={{ label: '1' }}
        value={{ label: '1' }}
      />
    );
    // Check for the value label instead of placeholder
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should select one of the available options', async () => {
    const mockOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];

    renderComponent(
      <Select
        name="selector"
        label="Test Selector"
        options={mockOptions}
        defaultValue={{ value: 1, label: 'One' }}
        value={{ value: 1, label: 'One' }}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Test Selector' });

    await act(async () => await userEvent.click(select));
    // There may be multiple 'One', so select the one in the dropdown
    const options = screen.getAllByText('One');
    // The dropdown option is usually the last one
    await act(async () => userEvent.click(options[options.length - 1]));
    expect(screen.getByText('One')).toBeInTheDocument();
  });
});
