import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../index';

describe('Dropdown tests', () => {
  const defaultOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  it('should render the component with default options', () => {
    render(<Dropdown options={defaultOptions} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('should display options when clicked', async () => {
    render(<Dropdown options={defaultOptions} />);
    const dropdown = screen.getByText('Select...');
    fireEvent.mouseDown(dropdown); // react-select prefers mouseDown

    expect(await screen.findByText('Option 1')).toBeInTheDocument();
    expect(await screen.findByText('Option 2')).toBeInTheDocument();
  });

  it('should call onChange when an option is selected', async () => {
    const onChange = jest.fn();
    render(<Dropdown options={defaultOptions} onChange={onChange} />);
    const dropdown = screen.getByText('Select...');
    fireEvent.mouseDown(dropdown);

    const option = await screen.findByText('Option 1');
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith({ value: '1', label: 'Option 1' });
  });

  it('should handle rendering with no options gracefully', () => {
    render(<Dropdown options={[]} />);
    const dropdown = screen.getByText('Select...');
    fireEvent.click(dropdown);

    const options = screen.queryByRole('option');
    expect(options).not.toBeInTheDocument();
  });

  it('should support accessibility attributes', () => {
    render(<Dropdown options={defaultOptions} aria-label="Dropdown Menu" />);
    const dropdown = screen.getByLabelText('Dropdown Menu');
    expect(dropdown).toBeInTheDocument();
  });
});
