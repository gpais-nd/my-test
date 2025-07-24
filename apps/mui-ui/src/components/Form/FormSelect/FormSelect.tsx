import { ReactElement } from 'react';
import { Controller } from 'react-hook-form';
import { CountingOption } from '../types';
import { default as ReactSelect, CSSObjectWithLabel } from 'react-select';
import styles from './FormSelect.module.scss';
import ChevronIcon from './images/ChevronIcon';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export interface GenericOptionType {
  label?: string | ReactElement;
  count?: number;
}

interface Props<T extends GenericOptionType> {
  name: string;
  label?: string;
  defaultValue?: string | CountingOption | null;
  options: T[];
  placeholder?: string;
  classNames?: {
    label?: string;
    input?: string;
  };
  selectProps?: Omit<StateManagerProps, 'isMulti' | 'defaultValue'>;
  // onChange?: ((newValue: SingleValue<T>, actionMeta: ActionMeta<T>) => void) | undefined
}

const FormSelect = <T extends GenericOptionType>({
  name,
  label,
  options,
  defaultValue = null,
  placeholder,
  classNames,
  selectProps,
}: Props<T>) => {
  const customStyles = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      height: '3.5rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
    }),
    indicatorSeparator: (styles: CSSObjectWithLabel) => ({
      ...styles,
      background: 'none',
      border: 'none',
    }),
    menuPortal: (styles: CSSObjectWithLabel) => ({
      ...styles,
      zIndex: 200,
    }),
    menu: (styles: CSSObjectWithLabel) => ({
      ...styles,
      width: 200,
    }),
  };

  const CustomDropdownIndicator = () => (
    <div className={styles.dropdownIndicator}>
      <ChevronIcon />
    </div>
  );

  const formatOptionLabel = (option: T) => (
    <div className={styles.selectOption}>
      <div>{option.label}</div>
      <div className={styles.count}>{option.count}</div>
    </div>
  );

  return (
    <div className={styles.select}>
      {label && <div className={classNames?.label}>{label}</div>}
      <Controller
        defaultValue={defaultValue}
        name={name}
        render={({ field }) => (
          <ReactSelect<T>
            {...selectProps}
            {...field}
            aria-label={label}
            styles={customStyles}
            classNames={{
              control: () => `${styles.input} ${classNames?.input}`,
            }}
            options={options}
            formatOptionLabel={formatOptionLabel}
            menuPortalTarget={document.body}
            placeholder={placeholder}
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            // onChange={}
          />
        )}
      />
    </div>
  );
};

export default FormSelect;
