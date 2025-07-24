import { FC, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './Field.module.scss';
import { Option } from '../types';
import { Dropdown } from '../../Dropdown';
import ClassIcon from '@mui/icons-material/Class';

const NO_VALUE_PLACEHOLDER = '';

interface Props {
  name: string;
  label?: string;
  value?: string | number;
  valueOnReadMode?: string | number | ReactElement;
  isEditable?: boolean;
  onEdit?: boolean;
  placeholder?: string;
  classNames?: {
    field?: string;
    label?: string;
    value?: string;
    input?: string;
  };
  customInputIcon?: ReactElement;
  editingOptions?: Option[];
  onClick?: () => void;
  glossary?: boolean;
}

const Field: FC<Props> = ({
  name,
  label,
  value,
  valueOnReadMode,
  isEditable = false,
  onEdit = false,
  placeholder,
  classNames,
  customInputIcon,
  editingOptions,
  onClick,
  glossary,
}) => {
  const { register } = useFormContext();

  const onReadMode = (
    <div className={classNames?.value} data-testid="field-on-read-mode">
      {value === undefined || value === null
        ? NO_VALUE_PLACEHOLDER
        : valueOnReadMode !== undefined
        ? valueOnReadMode
        : value}
    </div>
  );

  const onEditMode = (
    <div className={styles.input}>
      {editingOptions ? (
        <Dropdown
          name={name}
          defaultValue={editingOptions.find(option => {
            const parsedValue =
              value === 'true' ? '1' : value === 'false' ? '0' : value;
            return option.value === parsedValue;
          })}
          options={editingOptions}
          returnSingleField="value"
          withinForm
        />
      ) : (
        <input
          aria-label={name}
          className={classNames?.input}
          defaultValue={value}
          {...(isEditable ? { ...register(name) } : {})}
          placeholder={placeholder}
        />
      )}
      {customInputIcon ? (
        <div className={styles.customInputIcon}>{customInputIcon}</div>
      ) : null}
    </div>
  );

  return (
    <div className={`${styles.field} ${classNames?.field}`}>
      {label && (
        <div className={classNames?.label}>
          <span>{label}</span>
          {glossary && (
            <ClassIcon
              fontSize="small"
              onClick={onClick}
              className={styles.icon}
            />
          )}
        </div>
      )}
      {isEditable && onEdit ? onEditMode : onReadMode}
    </div>
  );
};

export default Field;
