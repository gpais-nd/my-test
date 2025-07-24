import { ReactElement } from 'react';
import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FieldInlineEditing from '../FieldInlineEditing';
import userEvent from '@testing-library/user-event';

const renderComponent = (component: ReactElement) => {
  render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DataSource tests', () => {
  it('should render the component', () => {
    renderComponent(<FieldInlineEditing name="myField" onSubmit={jest.fn()} />);

    expect(screen.getByTestId('field-on-read-mode')).toBeEmptyDOMElement();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
  });

  it('should render the component with a default value', () => {
    renderComponent(
      <FieldInlineEditing
        name="myField"
        value="My default value"
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByText('---')).not.toBeInTheDocument();
    expect(screen.getByText('My default value')).toBeInTheDocument();
  });

  it('should enter in edit mode and save if click on save', async () => {
    const onSubmit = jest.fn();
    renderComponent(<FieldInlineEditing name="myField" onSubmit={onSubmit} />);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await act(async () => {
      await userEvent.click(editButton);
    });

    const inputField = screen.getByRole('textbox', { name: 'myField' });
    await userEvent.type(inputField, 'new value');
    expect(inputField).toHaveValue('new value');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(saveButton);

    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(onSubmit.mock.calls[1][0]).toEqual({ myField: 'new value' });
  });
});
