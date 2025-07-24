import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { DetailsTitle } from '../index';
import { Button } from 'components/Grid/GridHeader/Button';

describe('DetailsTitle tests', () => {
  it('should render a details title without actions', async () => {
    render(
      <DetailsTitle title="Details page" dataSourceName="TestDataSource" />
    );

    expect(screen.getByText('Details page')).toBeInTheDocument();
  });

  it('should render a details title with custom actions', async () => {
    const actions: ReactElement[] = [
      <Button onClick={() => {}}>Click me</Button>,
    ];
    render(
      <DetailsTitle
        title="Details page"
        dataSourceName="TestDataSource"
        actions={actions}
      />
    );

    expect(screen.getByText('Details page')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should handle rendering with no title gracefully', async () => {
    render(<DetailsTitle title="" dataSourceName="TestDataSource" />);
    const titleElement = screen.queryByText('');
    expect(titleElement).not.toBeInTheDocument();
  });

  it('should handle rendering with empty actions gracefully', async () => {
    render(
      <DetailsTitle
        title="Details page"
        dataSourceName="TestDataSource"
        actions={[]}
      />
    );
    expect(screen.getByText('Details page')).toBeInTheDocument();
    const buttonElement = screen.queryByRole('button');
    expect(buttonElement).not.toBeInTheDocument();
  });

  it('should support additional props', async () => {
    render(
      <div className="custom-class">
        <DetailsTitle
          title="Details page"
          data-testid="details-title"
          dataSourceName="TestDataSource"
        />
      </div>
    );

    const titleElement = screen.getByTestId('details-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('custom-class');
  });

  it('should support accessibility attributes', async () => {
    render(
      <DetailsTitle
        title="Details page"
        dataSourceName="TestDataSource"
        aria-label="Details Title"
      />
    );

    const titleElement = screen.getByLabelText('Details Title');
    expect(titleElement).toBeInTheDocument();
  });
});
