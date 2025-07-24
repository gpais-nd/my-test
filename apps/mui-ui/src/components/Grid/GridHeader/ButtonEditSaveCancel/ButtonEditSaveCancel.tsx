import { FC } from 'react';
import Button, {
  ButtonIconType,
} from 'components/Grid/GridHeader/Button/Button';

interface Props {
  isInEdition: boolean;
  setInEdition: (x: boolean) => void;
  formName?: string;
  className?: string;
}

const ButtonEditSaveCancel: FC<Props> = ({
  isInEdition,
  setInEdition,
  formName,
  className,
}) => {
  function onEdit() {
    setInEdition(true);
  }
  function onSave() {
    setInEdition(false);
  }
  function onCancel() {
    setInEdition(false);
  }
  return (
    <div className={className}>
      <Button
        onClick={() => (isInEdition ? onSave() : onEdit())}
        formName={isInEdition ? undefined : formName}
        iconType={isInEdition ? undefined : ButtonIconType.EDIT}
      >
        {isInEdition ? 'Save' : 'Edit'}
      </Button>
      {isInEdition && <Button onClick={() => onCancel()}>Cancel</Button>}
    </div>
  );
};

export default ButtonEditSaveCancel;
