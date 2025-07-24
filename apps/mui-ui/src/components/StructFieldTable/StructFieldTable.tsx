import { FC } from 'react';
import { Grid } from '../Grid';
import { StructField, TableColumnElement } from '../../types/entities.types';
import { GridColumnHeader } from '../Grid/types';
import { uniqueId } from '../../utils';
import styles from './StructFieldTable.module.scss';

interface Props {
  structFieldData: StructField;
}

const StructFieldTable: FC<Props> = ({ structFieldData }) => {
  const headers: GridColumnHeader[] = [
    {
      name: 'name',
      label: 'Name',
      className: styles.structFieldHeader,
    },
    {
      name: 'type',
      label: 'Type',
      className: styles.structFieldHeader,
    },
  ];

  const data: TableColumnElement[] =
    structFieldData.fields && structFieldData.fields.length > 0
      ? structFieldData.fields.map(field => ({
          id: field.name ?? uniqueId().toString(),
          name: field.name ?? '',
          type:
            typeof field.type === 'string'
              ? field.type
              : typeof field.type.type === 'string'
              ? field.type.type
              : 'struct',
          collapsibleContent:
            typeof field.type !== 'string' &&
            field.type.fields &&
            field.type.fields?.length > 0 ? (
              <StructFieldTable
                structFieldData={{
                  type: field.name ?? '',
                  fields: field.type.fields,
                }}
              />
            ) : undefined,
        }))
      : [];

  return (
    <div className={styles.gridContainer}>
      <Grid
        headers={headers}
        data={data}
        className={styles.structTable}
        collapsibleRows
        hidePagination
        noBorderLine
        currentPagination={{ offset: 0, limit: 10000 }}
      />
    </div>
  );
};

export default StructFieldTable;
