import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { OverflowText } from '../index';

const styles = {
  height: '100px',
  overflow: 'hidden',
  width: '200px',
};

const renderComponent = (component: ReactElement) => {
  render(<div style={styles}>{component}</div>);
};

describe('OverflowText tests', () => {
  it('should render the  the component', async () => {
    renderComponent(<OverflowText>Lorem ipsum dolor sit amet</OverflowText>);

    expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument();
  });
});
