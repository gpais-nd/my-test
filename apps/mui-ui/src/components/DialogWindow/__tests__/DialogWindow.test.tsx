import { render, screen, fireEvent } from '@testing-library/react';
import DialogWindow from '../index';

describe('DialogWindow tests', () => {
  it('should render the component with title and content', () => {
    const title = 'Test';

    render(
      <DialogWindow title={title} isOpen={true} modalClose={() => {}}>
        <p>Test Content</p>
      </DialogWindow>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should not render the dialog when isOpen is false', () => {
    render(
      <DialogWindow title="Test" isOpen={false} modalClose={() => {}}>
        <p>Test Content</p>
      </DialogWindow>
    );

    const dialogElement = screen.queryByText('Test Content');
    expect(dialogElement).not.toBeInTheDocument();
  });

  it('should call modalClose when close button is clicked', () => {
    const modalClose = jest.fn();

    render(
      <DialogWindow title="Test" isOpen={true} modalClose={modalClose}>
        <p>Test Content</p>
      </DialogWindow>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(modalClose).toHaveBeenCalledTimes(1);
  });

  it('should handle rendering without children gracefully', () => {
    render(<DialogWindow title="Test" isOpen={true} modalClose={() => {}} />);

    const dialogElement = screen.getByRole('dialog');
    expect(dialogElement).toBeInTheDocument();
    expect(dialogElement).toBeEmptyDOMElement();
  });

  it('should support accessibility attributes', () => {
    render(
      <DialogWindow
        title="Accessible Dialog"
        isOpen={true}
        modalClose={() => {}}
        aria-label="Dialog Window"
      >
        <p>Accessible Content</p>
      </DialogWindow>
    );

    const dialogElement = screen.getByLabelText('Dialog Window');
    expect(dialogElement).toBeInTheDocument();
  });
});
