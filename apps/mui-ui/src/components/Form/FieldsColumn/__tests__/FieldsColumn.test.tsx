import { render } from '@testing-library/react';
import { FieldsColumn } from '../index';

describe('FieldsColum tests', () => {
  it('should render an empty component', async () => {
    const { container } = render(<FieldsColumn>{}</FieldsColumn>);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should render an empty component with custom className', async () => {
    const { container } = render(
      <FieldsColumn className="fieldsColumnClassName">{}</FieldsColumn>
    );

    expect(container.firstChild).toHaveClass('fieldsColumnClassName');
  });
});
