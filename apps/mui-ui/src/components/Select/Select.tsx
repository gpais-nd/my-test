import { ReactElement } from 'react';
import {
  default as ReactSelect,
  CSSObjectWithLabel,
  Props as SelectProps,
} from 'react-select';
import styles from './Select.module.scss';
import ChevronIcon from './images/ChevronIcon';

interface GenericOptionType {
  label?: string | ReactElement;
  count?: number;
}

interface Props<T extends GenericOptionType>
  extends Omit<SelectProps, 'isMulti' | 'defaultValue'> {
  label?: string;
  options: T[];
  classNames?: {};
  defaultValue: T;
  value: T | null;
}

const Select = <T extends GenericOptionType>({
  label,
  options,
  value,
  ...props
}: Props<T>) => {
  const customStyles = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      height: '1rem',
      paddingLeft: '0.1rem',
      paddingRight: '0.1rem',
      fontWeight: '400',
    }),
    indicatorSeparator: (styles: CSSObjectWithLabel) => ({
      ...styles,
      background: 'none',
      border: 'none',
    }),
    valueContainer: (styles: CSSObjectWithLabel) => ({
      ...styles,
      padding: '0 0.2rem',
    }),
    clearIndicator: (styles: CSSObjectWithLabel) => ({
      ...styles,
      padding: 0,
    }),
    menuPortal: (styles: CSSObjectWithLabel) => ({
      ...styles,
      zIndex: 200,
    }),
    menu: (styles: CSSObjectWithLabel) => ({
      ...styles,
      width: '100%',
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
      {label && <div className={'classNames?.label'}>{label}</div>}
      <ReactSelect<T>
        {...props}
        aria-label={label}
        styles={customStyles}
        options={options}
        formatOptionLabel={formatOptionLabel}
        menuPortalTarget={document.body}
        components={{ DropdownIndicator: CustomDropdownIndicator }}
        value={value}
      />
    </div>
  );
};

export default Select;
