import { render, screen } from '@testing-library/react';
import { PartitionColumns } from '../index';

describe('PartitionColumns tests', () => {
  it('should render the component', () => {
    render(<PartitionColumns query="SELECT * FROM tableName" />);

    expect(screen.getByText('Partition Columns')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Always include a partition column predicate when querying this table, e.g.:'
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/SELECT/)).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });
});
