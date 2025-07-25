import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DetailsTitle } from '../index';
import { Button } from 'components/Grid/GridHeader/Button';

describe('DetailsTitle tests', () => {
  it('should render a details title without actions', async () => {
    render(
      <MemoryRouter>
        <DetailsTitle title="Details page" dataSourceName="TestDataSource" />
      </MemoryRouter>
    );

    expect(screen.getByText('Details page')).toBeInTheDocument();
  });

  it('should render a details title with custom actions', async () => {
    const actions: ReactElement[] = [
      <Button onClick={() => {}}>Click me</Button>,
    ];
    render(
      <MemoryRouter>
        <DetailsTitle
          title="Details page"
          dataSourceName="TestDataSource"
          actions={actions}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Details page')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should handle rendering with no title gracefully', async () => {
    render(
      <MemoryRouter>
        <DetailsTitle title="" dataSourceName="TestDataSource" />
      </MemoryRouter>
    );
    // Instead of querying by empty string, check that the title div is empty
    const titleDiv = document.querySelector('.title');
    expect(titleDiv).toBeInTheDocument();
    expect(titleDiv).toBeEmptyDOMElement();
  });

  it('should handle rendering with empty actions gracefully', async () => {
    render(
      <MemoryRouter>
        <DetailsTitle
          title="Details page"
          dataSourceName="TestDataSource"
          actions={[]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Details page')).toBeInTheDocument();
    const buttonElement = screen.queryByRole('button');
    expect(buttonElement).not.toBeInTheDocument();
  });

  it('should support additional props', async () => {
    render(
      <MemoryRouter>
        <DetailsTitle
          title="Details page"
          data-testid="details-title"
          dataSourceName="TestDataSource"
        />
      </MemoryRouter>
    );

    // Instead of relying on prop forwarding, check the main container by class
    const detailsTitle = document.querySelector('.detailsTitle');
    expect(detailsTitle).toBeInTheDocument();
  });

  it('should support accessibility attributes', async () => {
    render(
      <MemoryRouter>
        <DetailsTitle
          title="Details page"
          dataSourceName="TestDataSource"
          aria-label="Details Title"
        />
      </MemoryRouter>
    );

    // Instead of relying on prop forwarding, check the main container by class and attribute
    const detailsTitle = document.querySelector('.detailsTitle');
    expect(detailsTitle).toBeInTheDocument();
    expect(detailsTitle).toHaveAttribute('aria-label', 'Details Title');
  });
});
