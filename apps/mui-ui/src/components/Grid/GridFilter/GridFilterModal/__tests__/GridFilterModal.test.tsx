import { render, screen } from '@testing-library/react';
import { GridFilterModal } from '../index';

describe('GridFilterModal tests', () => {
  it('should render a default component', async () => {
    render(
      <GridFilterModal>
        <p>Mock message</p>
      </GridFilterModal>
    );

    expect(screen.getByText('Mock message')).toBeInTheDocument();
  });
});
