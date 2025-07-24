import { ReactElement, useContext, useState } from 'react';
import { GenericGridRow, GridColumnHeader } from 'components/Grid/types';
import { IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './../../Grid.module.scss';
import { GridContext } from '../../Grid';

interface Props<T extends GenericGridRow> {
  headers: GridColumnHeader[];
  record: T;
}

const GridDataRow = <T extends GenericGridRow>({
  headers,
  record,
}: Props<T>) => {
  const gridContext = useContext(GridContext);
  const collapsibleRows =
    gridContext?.collapsibleRows && gridContext.collapsibleRows === true;
  const [isOpen, setIsOpen] = useState(false);

  const entries = headers.map(header => ({
    key: header.name,
    value: record[header.name as keyof T],
  }));

  return (
    <>
      <tr>
        {!collapsibleRows ? undefined : record?.collapsibleContent !==
          undefined ? (
          <td className={styles.collapsible}>
            <IconButton onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </td>
        ) : (
          <td></td>
        )}
        {entries.map(entry => (
          <td key={entry.key}>{entry.value as unknown as ReactElement}</td>
        ))}
      </tr>
      {record?.collapsibleContent && isOpen && (
        <tr>
          <td colSpan={entries.length + 1}>{record.collapsibleContent}</td>
        </tr>
      )}
    </>
  );
};

export default GridDataRow;
