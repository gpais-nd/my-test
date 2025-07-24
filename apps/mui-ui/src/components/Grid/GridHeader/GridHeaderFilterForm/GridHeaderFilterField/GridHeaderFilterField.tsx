import { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { Filter } from '../../../types';
import { CountingOption, Option } from '../../../../Form/types';
import styles from './../../../Grid.module.scss';
import { GridContext } from '../../../Grid';
import { useDebounce } from '../../../../../hooks/useDebounce';
import { Select } from '../../../../Select';
import { TextField } from '@mui/material';
import { datadogRum } from '@datadog/browser-rum';

interface Props {
  headerName: string;
  filter: Filter;
}

const GridHeaderFilterField: FC<Props> = ({ headerName, filter }) => {
  const gridContext = useContext(GridContext);
  const { debounce } = useDebounce({});

  const [selectedValue, setSelectedValue] = useState<string | Option>('');

  useEffect(() => {
    if (filter.type === 'text') {
      if (!selectedValue.toString().includes('"')) {
        updateDebouncedTextValue(selectedValue as string);
      }
    } else if (gridContext?.updateValueFilter) {
      gridContext.updateValueFilter({
        ...filter,
        selectedValue: (selectedValue as CountingOption) ?? undefined,
      });
      if (selectedValue) {
        datadogRum.addAction('filter', {
          [filter.remoteSearchFields[0]]: (selectedValue as Option).value,
        });
      }
    }
  }, [selectedValue]);

  useEffect(() => {
    const updatedValue = gridContext?.selectedFilters?.find(
      f => f.headerName === filter?.headerName
    )?.selectedValue as string;
    if (updatedValue) {
      setSelectedValue(updatedValue);
    } else {
      setSelectedValue('');
    }
  }, [gridContext?.selectedFilters]);

  const updateDebouncedTextValue = async (text: string) => {
    if (gridContext?.updateValueFilter && filter) {
      gridContext.updateValueFilter({
        ...filter,
        selectedValue: await debounce(text),
      });
      if (text) {
        datadogRum.addAction('filter', {
          [filter.remoteSearchFields[0]]: text,
        });
      }
    }
  };

  const getFieldByType = (filter: Filter): ReactElement => {
    switch (filter.type) {
      case 'aggregation':
      case 'options':
        return (
          <Select
            key={`${headerName}_filter`}
            name={headerName}
            options={filter.options as Option[]}
            defaultValue={(selectedValue as Option) ?? null}
            placeholder=""
            value={(selectedValue as Option) ?? null}
            onChange={newValue => setSelectedValue(newValue as Option)}
            isClearable
          />
        );
      default:
        return (
          <div style={{ width: '100%' }}>
            <TextField
              className={styles.inputField}
              size="small"
              value={selectedValue}
              onChange={newValue => setSelectedValue(newValue.target.value)}
            />
          </div>
        );
    }
  };

  return <>{filter.hidden === true ? <></> : getFieldByType(filter)}</>;
};

export default GridHeaderFilterField;
