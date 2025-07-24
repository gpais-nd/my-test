import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import {
  default as ReactSelect,
  CSSObjectWithLabel,
  Props as SelectProps,
  SingleValue,
  MultiValue,
  PropsValue,
} from 'react-select';
import { GenericTypeWithValue } from '../../types/utils.types';
import ChevronIcon from '../Form/FormSelect/images/ChevronIcon';
import styles from './Dropdown.module.scss';

interface Props<T extends GenericTypeWithValue>
  extends Omit<SelectProps, 'onChange'> {
  options: T[];
  withinForm?: boolean;
  name?: string;
  defaultValue?: PropsValue<T> | undefined;
  onChange?: (value: unknown) => void;
  labelField?: keyof T;
  showSideLabel?: boolean;
  sideLabelField?: keyof T;
  returnSingleField?: keyof T;
}

const Dropdown = <T extends GenericTypeWithValue>({
  options,
  withinForm = false,
  name = '',
  onChange,
  labelField = 'label' as keyof T,
  showSideLabel,
  sideLabelField,
  returnSingleField,
  ...props
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
  };

  const CustomDropdownIndicator = () => (
    <div className={styles.dropdownIndicator}>
      <ChevronIcon />
    </div>
  );

  const formatOptionLabel = (option: T): ReactNode => {
    return labelField && showSideLabel && sideLabelField ? (
      <div className={styles.dropdownOption}>
        <div>{option[labelField] as unknown as ReactNode}</div>
        <div className={styles.sideLabel}>
          {option[sideLabelField] as unknown as ReactNode}
        </div>
      </div>
    ) : (
      <div className={styles.dropdownOption}>
        <div>{option[labelField] as unknown as ReactNode}</div>
      </div>
    );
  };

  const handleChange = (selected: SingleValue<T> | MultiValue<T>): void => {
    if (selected && onChange) {
      if (Array.isArray(selected) && props.isMulti) {
        onChange(
          (selected as T[]).map(option =>
            returnSingleField ? option[returnSingleField] : (option as T)
          )
        );
      } else {
        onChange(
          returnSingleField
            ? (selected as T)[returnSingleField]
            : (selected as T)
        );
      }
    }
  };

  return (
    <>
      {withinForm ? (
        <Controller
          name={name}
          render={({ field }) => (
            <ReactSelect
              {...field}
              {...props}
              styles={customStyles}
              classNames={{
                control: () => styles.input,
              }}
              options={options}
              formatOptionLabel={formatOptionLabel}
              menuPortalTarget={document.body}
              components={{ DropdownIndicator: CustomDropdownIndicator }}
            />
          )}
        />
      ) : (
        <>
          {/* ignored due TS cannot identify when isMulti and the returned value in onChange */}
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <ReactSelect<T>
            {...props}
            styles={customStyles}
            classNames={{
              control: () => styles.input,
            }}
            options={options}
            formatOptionLabel={formatOptionLabel}
            menuPortalTarget={document.body}
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            getOptionLabel={(option: T) =>
              option[labelField] as unknown as string
            }
            {...(onChange && !props.isMulti
              ? {
                  isMulti: false,
                  onChange: newValue =>
                    handleChange(newValue as SingleValue<T>),
                }
              : {})}
            {...(onChange && props.isMulti
              ? {
                  isMulti: true,
                  onChange: newValue =>
                    handleChange(newValue as unknown as MultiValue<T>),
                }
              : {})}
          />
        </>
      )}
    </>
  );
};

export default Dropdown;
