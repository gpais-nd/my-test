import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '../index';
import { Field } from '../Field';

const onSubmit = jest.fn();

describe('Form tests', () => {
  it('should render an empty form', async () => {
    render(
      <Form id="form" onSubmit={onSubmit}>
        <div></div>
      </Form>
    );

    expect(screen.getByRole('form', { name: 'form' })).toBeInTheDocument();
  });

  it('should render an empty component with the class to show columns as flexbox', async () => {
    const { container } = render(
      <Form id="form" onSubmit={onSubmit} displayColumns>
        <div></div>
      </Form>
    );

    expect(container.firstChild).toHaveClass('formColumnsLayout');
  });

  it('should render an empty form with custom aria-label', async () => {
    render(
      <Form id="form" onSubmit={onSubmit} ariaLabel="customDormAriaLabel">
        <div></div>
      </Form>
    );

    expect(
      screen.getByRole('form', { name: 'customDormAriaLabel' })
    ).toBeInTheDocument();
  });

  it('should return a value for a form with a text field', async () => {
    render(
      <Form id="form" onSubmit={onSubmit} ariaLabel="customDormAriaLabel">
        <Field name="color" label="Color" value="red" isEditable onEdit />
        <button type="submit">Submit</button>
      </Form>
    );

    const input: HTMLInputElement = screen.getByRole('textbox', {
      name: 'color',
    });
    const button = screen.getByRole('button');

    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('red');

    await userEvent.type(input, ' and blue');
    expect(input.value).toBe('red and blue');

    await userEvent.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should handle rendering without children gracefully', async () => {
    render(
      <Form id="form" onSubmit={onSubmit}>
        {<></>}
      </Form>
    );
    const formElement = screen.getByRole('form', { name: 'form' });
    expect(formElement).toBeInTheDocument();
    expect(formElement).toBeEmptyDOMElement();
  });

  it('should handle multiple fields and interactions', async () => {
    render(
      <Form id="form" onSubmit={onSubmit}>
        <Field name="color" label="Color" value="red" isEditable onEdit />
        <Field name="size" label="Size" value="large" isEditable onEdit />
        <button type="submit">Submit</button>
      </Form>
    );

    const colorInput: HTMLInputElement = screen.getByRole('textbox', {
      name: 'color',
    });
    const sizeInput: HTMLInputElement = screen.getByRole('textbox', {
      name: 'size',
    });
    const button = screen.getByRole('button');

    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(colorInput).toHaveValue('red');
    expect(sizeInput).toHaveValue('large');

    await userEvent.type(colorInput, ' and blue');
    await userEvent.type(sizeInput, ' and small');

    expect(colorInput.value).toBe('red and blue');
    expect(sizeInput.value).toBe('large and small');

    await userEvent.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should support accessibility attributes', async () => {
    render(
      <Form id="form" onSubmit={onSubmit} ariaLabel="Accessible Form">
        <Field name="color" label="Color" value="red" isEditable onEdit />
      </Form>
    );

    const formElement = screen.getByLabelText('Accessible Form');
    expect(formElement).toBeInTheDocument();
  });
});
