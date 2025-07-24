import { GridDataRow } from './GridDataRow';
import { GenericGridRow, GridColumnHeader } from '../types';

interface Props<T extends GenericGridRow> {
  headers: GridColumnHeader[];
  data: T[];
}

const GridData = <T extends GenericGridRow>({ headers, data }: Props<T>) => {
  return (
    <tbody>
      {data.map(record => (
        <GridDataRow key={record.id} headers={headers} record={record} />
      ))}
    </tbody>
  );
};

export default GridData;
