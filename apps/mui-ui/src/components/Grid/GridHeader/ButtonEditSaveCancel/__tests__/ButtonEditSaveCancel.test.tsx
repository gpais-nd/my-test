import { render, screen } from '@testing-library/react';
import ButtonEditSaveCancel from '../ButtonEditSaveCancel';
import userEvent from '@testing-library/user-event';

describe('ButtonEditSave tests', () => {
  it('should render the button in edit mode', async () => {
    const setInEdition = jest.fn();

    render(
      <ButtonEditSaveCancel isInEdition={false} setInEdition={setInEdition} />
    );

    expect(
      screen.getByRole('button', { name: 'Edit Edit' })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Edit' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Edit' }));

    expect(setInEdition).toHaveBeenCalledTimes(1);
    expect(setInEdition).toHaveBeenCalledWith(true);
  });

  it('should render the button in save mode', async () => {
    const setInEdition = jest.fn();

    render(
      <ButtonEditSaveCancel isInEdition={true} setInEdition={setInEdition} />
    );

    expect(
      screen.queryByRole('button', { name: 'Edit Edit' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(setInEdition).toHaveBeenCalledTimes(1);
    expect(setInEdition).toHaveBeenCalledWith(false);
  });
});
