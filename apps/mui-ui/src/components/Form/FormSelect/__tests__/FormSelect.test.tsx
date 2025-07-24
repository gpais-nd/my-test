import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { FormSelect } from '../index';
import Form from '../../Form';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const onSubmit = jest.fn();

const renderComponent = (component: ReactElement) => {
  render(
    <Form id="mockForm" onSubmit={onSubmit}>
      {component}
    </Form>
  );
};

describe('Select tests', () => {
  it('should render a default select component', async () => {
    renderComponent(
      <FormSelect name="selector" label="Test Selector" options={[]} />
    );

    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('should select one of the available options', async () => {
    const mockOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];

    renderComponent(
      <FormSelect name="selector" label="Test Selector" options={mockOptions} />
    );

    const select = screen.getByRole('combobox', { name: 'Test Selector' });

    await act(async () => await userEvent.click(select));
    await act(async () => userEvent.click(screen.getByText('One')));

    expect(screen.getByText('One')).toBeInTheDocument();
  });
});
