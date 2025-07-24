import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LinkTabs, { LinkTab } from '../LinkTabs';

const renderComponent = (component: ReactElement) => {
  render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('LinkTabs tests', () => {
  it('should render the component', () => {
    const linkTabs: LinkTab[] = [
      { label: 'Link 1', url: '/link1' },
      { label: 'Link 2', url: '/link2' },
    ];

    renderComponent(<LinkTabs linkTabs={linkTabs} />);
    expect(screen.getByRole('link', { name: 'Link 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link 2' })).toBeInTheDocument();
  });

  it('should change class when click on a LinkTab', async () => {
    const linkTabs: LinkTab[] = [
      { label: 'Link 1', url: '/link1' },
      { label: 'Link 2', url: '/link2', isSelected: true },
    ];

    renderComponent(<LinkTabs linkTabs={linkTabs} />);

    const link = screen.getByRole('link', { name: 'Link 2' });
    expect(link).toHaveClass('linkSelected');
  });
});
