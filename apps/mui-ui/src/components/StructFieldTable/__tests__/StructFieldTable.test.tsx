import { render, screen } from '@testing-library/react';
import StructFieldTable from '../StructFieldTable';
import { StructField } from '../../../types/entities.types';

const simpleStructField: StructField = {
  name: 'Struct Field A',
  type: 'struct',
  fields: [
    {
      name: 'Sub-struct Field A1',
      type: 'string',
    },
    {
      name: 'Sub-struct Field A2',
      type: 'string',
    },
    {
      name: 'Sub-struct Field A3',
      type: 'number',
    },
  ],
};

describe('StructFieldTable tests', () => {
  it('should render a default component', async () => {
    render(<StructFieldTable structFieldData={simpleStructField} />);

    expect(screen.getByText('Sub-struct Field A1')).toBeInTheDocument();
    expect(screen.getByText('Sub-struct Field A2')).toBeInTheDocument();
    expect(screen.getByText('Sub-struct Field A3')).toBeInTheDocument();
  });
});
