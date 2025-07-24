import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Select } from '../index';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const renderComponent = (component: ReactElement) => {
  render(component);
};

describe('Select tests', () => {
  it('should render a default select component', async () => {
    renderComponent(
      <Select
        name="selector"
        label="Test Selector"
        options={[]}
        defaultValue={{ label: '1' }}
        value={{ label: '1' }}
      />
    );

    expect(screen.getByText('Select...')).toBeInTheDocument();
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
    await act(async () => userEvent.click(screen.getByText('One')));

    expect(screen.getByText('One')).toBeInTheDocument();
  });
});
