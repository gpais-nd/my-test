import { FC, useState } from 'react';
import Field from '../Field/Field';
import Form from '../Form';
import { FieldValues } from 'react-hook-form';
import styles from './FieldInlineEditing.module.scss';
import { Button } from 'components/Button';
import EditIcon from './images/EditIcon';
import SaveIcon from './images/SaveIcon';

interface Props {
  name: string;
  value?: string | number;
  onSubmit: (data: FieldValues) => void;
  isEditable?: boolean;
  classNames?: {
    field?: string;
    label?: string;
    value?: string;
    input?: string;
  };
}

const FieldInlineEditing: FC<Props> = ({
  name,
  value,
  onSubmit,
  isEditable = true,
  classNames,
}) => {
  const [onEdit, setOnEdit] = useState(false);

  const handleEditClick = (): void => {
    setOnEdit(true);
  };

  const handleSaveClick = (): void => {
    setTimeout(() => {
      setOnEdit(false);
    }, 100);
  };

  return (
    <Form id={name} onSubmit={onSubmit} className={styles.fieldInlineEditing}>
      <div className={styles.content}>
        <Field
          key={name}
          name={name}
          value={value}
          isEditable={isEditable}
          onEdit={onEdit}
          classNames={classNames}
        />
      </div>
      {isEditable && (
        <div className={styles.buttons}>
          {!onEdit && (
            <Button onClick={handleEditClick} aria-label="Edit">
              <EditIcon />
            </Button>
          )}
          {onEdit && (
            <Button onClick={handleSaveClick} aria-label="Save">
              <SaveIcon />
            </Button>
          )}
        </div>
      )}
    </Form>
  );
};

export default FieldInlineEditing;
