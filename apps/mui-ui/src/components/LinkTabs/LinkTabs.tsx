import { FC, useState, useEffect } from 'react';
import { CSSSizeValue } from 'types/utils.types';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './LinkTabs.module.scss';
import { useDebounce } from '../../hooks/useDebounce';
import { Filter } from '../Grid/types';
import { datadogRum } from '@datadog/browser-rum';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlatformIcon } from 'utils/datasources.utils';

export interface LinkTab {
  name: string;
  label: string;
  url: string;
  isSelected?: boolean;
}

interface Props {
  linkTabs: LinkTab[];
  stickyFromTop?: CSSSizeValue;
  searchFilter?: Filter;
  selectedFilters?: Filter[];
  onChangeFilter?: (filter: Filter) => void;
  selectedDataSource?: string;
}

const LinkTabs: FC<Props> = ({
  linkTabs,
  stickyFromTop,
  searchFilter,
  selectedFilters,
  onChangeFilter,
  selectedDataSource,
}) => {
  const { debounce } = useDebounce({});
  const { dataSourceByUrl } = useParams();
  const [filterDataSource, setFilterDataSource] = useState<string>(
    selectedDataSource || dataSourceByUrl || ''
  );
  const [freeTextSearch, setFreeTextSearch] = useState<string>(
    (selectedFilters?.find(f => f.headerName === searchFilter?.headerName)
      ?.selectedValue as string) ?? ''
  );
  const navigate = useNavigate();
  useEffect(() => {
    setFilterDataSource(selectedDataSource || '');
  }, [selectedDataSource]);

  useEffect(() => {
    updateDebouncedTextValue(freeTextSearch);
  }, [freeTextSearch]);

  useEffect(() => {
    const updatedValue = selectedFilters?.find(
      f => f.headerName === searchFilter?.headerName
    )?.selectedValue as string;

    if (updatedValue) {
      setFreeTextSearch(updatedValue);
    } else {
      setFreeTextSearch('');
    }
  }, [selectedFilters]);

  const updateDebouncedTextValue = async (text: string) => {
    const removedSlash = text.replace(/\/$/, '');
    if (searchFilter && onChangeFilter) {
      onChangeFilter({
        ...searchFilter,
        selectedValue: await debounce(removedSlash),
      });
      if (freeTextSearch) {
        datadogRum.addAction('search', { value: freeTextSearch });
      }
    }
  };

  const handleChangeDataSource = (event: SelectChangeEvent) => {
    setFilterDataSource(event.target.value);
    navigate(`/dataSource/${event.target.value}`);
  };

  return (
    <div
      className={`${styles.linkTabs} ${
        stickyFromTop !== undefined ? 'defaultSticky' : undefined
      }`}
      style={{ top: stickyFromTop }}
    >
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="datasources-label">DataSources</InputLabel>
        <Select
          labelId="datasources"
          id="datasources-select"
          label="DataSources"
          className={styles.listLink}
          value={filterDataSource}
          onChange={handleChangeDataSource}
        >
          {linkTabs.map(linkTab => (
            <MenuItem
              value={linkTab?.name}
              key={linkTab?.label}
              className={styles.menuItem}
            >
              <img
                src={getPlatformIcon(linkTab?.name)}
                alt={linkTab?.label}
                className={styles.datasourceIcon}
                style={{ marginRight: 10, width: 20 }}
              />
              {linkTab?.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        className={styles.searchField}
        size="small"
        value={freeTextSearch}
        onChange={newValue => setFreeTextSearch(newValue.target.value)}
      />
    </div>
  );
};

export default LinkTabs;
