import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ReactHookFormWrapper } from 'utils/tests/testsUtils';
import { Field } from '../index';

const renderComponent = (component: ReactElement) => {
  render(<ReactHookFormWrapper component={component} />);
};

describe('Field tests', () => {
  it('should implement style classes in edit mode', () => {
    renderComponent(
      <Field
        name="field"
        label="Field Label"
        classNames={{
          label: 'labelClassName',
          input: 'inputClassName',
        }}
        isEditable
        onEdit
      />
    );

    const label = screen.getByText('Field Label');
    const input = screen.getByRole('textbox', { name: 'field' });

    expect(label).toHaveClass('labelClassName');
    expect(input).toHaveClass('inputClassName');
  });

  it('should implement style classes in read mode', () => {
    renderComponent(
      <Field
        name="field"
        label="Field Label"
        value="Field Value"
        classNames={{
          label: 'labelClassName',
          value: 'valueClassName',
        }}
      />
    );

    const label = screen.getByText('Field Label');
    const value = screen.getByText('Field Value');

    expect(label).toHaveClass('labelClassName');
    expect(value).toHaveClass('valueClassName');
  });

  it('should render an empty field', () => {
    renderComponent(<Field name="field" label="Field Label" />);

    expect(screen.getByText('Field Label')).toBeInTheDocument();
    expect(screen.getByTestId('field-on-read-mode')).toBeEmptyDOMElement();
  });

  it('should render a field with a string value', () => {
    renderComponent(
      <Field name="field" label="Field Label" value="Field value" />
    );

    expect(screen.getByText('Field Label')).toBeInTheDocument();
    expect(screen.getByText('Field value')).toBeInTheDocument();
  });

  it('should render a field and prevent edit it on isEditable = false', () => {
    renderComponent(
      <Field
        name="testField"
        label="Field Label"
        value="Field value"
        onEdit
        isEditable={false}
      />
    );

    expect(
      screen.queryByRole('textbox', { name: 'testField' })
    ).not.toBeInTheDocument();
  });

  it('should render a field in edit mode', () => {
    renderComponent(
      <Field
        name="testField"
        label="Field Label"
        value="Field value"
        isEditable
        onEdit
      />
    );

    const inputField = screen.getByRole('textbox', { name: 'testField' });

    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveValue('Field value');
  });
});
