import { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LinkTabs, { LinkTab } from '../LinkTabs';

const renderComponent = (component: ReactElement) => {
  render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('LinkTabs tests', () => {
  it('should render the component', () => {
    const linkTabs: LinkTab[] = [
      { name: 'link1', label: 'Link 1', url: '/link1' },
      { name: 'link2', label: 'Link 2', url: '/link2' },
    ];

    renderComponent(<LinkTabs linkTabs={linkTabs} />);
    // Check for the dropdown (combobox) and menu items
    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();
    // Open the dropdown to reveal menu items
    fireEvent.mouseDown(combobox);
    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  it('should change class when click on a LinkTab', async () => {
    const linkTabs: LinkTab[] = [
      { name: 'link1', label: 'Link 1', url: '/link1' },
      { name: 'link2', label: 'Link 2', url: '/link2', isSelected: true },
    ];

    renderComponent(<LinkTabs linkTabs={linkTabs} />);

    // Open the dropdown and select 'Link 2'
    const combobox = screen.getByRole('combobox');
    fireEvent.mouseDown(combobox);
    const menuItem = screen.getByText('Link 2');
    expect(menuItem).toBeInTheDocument();
    fireEvent.click(menuItem);
    // After selection, the combobox value should update
    expect(combobox).toHaveTextContent('Link 2');
  });
});
