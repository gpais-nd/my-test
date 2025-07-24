import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { TableColumn } from '../../types/entities.types';
import styles from './PartitionColumns.module.scss';
import CopyIcon from './images/CopyIcon';
import { Button } from '../Button';

interface Props {
  query: string;
  columns?: TableColumn[];
}

const reservedWords = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'ORDER BY',
  'AND',
  'LIMIT',
];
const operators = ['*', '='];

const PartitionColumns: FC<Props> = ({ query, columns }) => {
  const [queryNode, setQueryNode] = useState<ReactElement>();
  const queryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQueryNode(hightLightSQL(query));
  }, [query]);

  const hightLightSQL = (query: string): ReactElement =>
    query.split(' ').reduce<ReactElement>((acc, word) => {
      if (reservedWords.includes(word)) {
        return (
          <>
            {acc} <span className={styles.reservedWord}>{word}</span>
          </>
        );
      } else if (operators.includes(word)) {
        return (
          <>
            {acc} <span className={styles.operator}>{word}</span>
          </>
        );
      } else {
        return (
          <>
            {acc} {word}
          </>
        );
      }
    }, <></>);

  const handleCopyQuery = () => {
    const textToCopy = queryRef.current?.innerText ?? '';
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <section className={styles.partitionColumns}>
      <div className={styles.title}>Partition Columns</div>
      <div className={styles.subtitle}>
        Always include a partition column predicate when querying this table
      </div>
      {query !== '' && (
        <>
          <div>For example:</div>
          <div className={styles.query}>
            <span className={styles.code} ref={queryRef}>
              {queryNode}
            </span>
            <Button onClick={handleCopyQuery} className={styles.copyButton}>
              <CopyIcon />
            </Button>
          </div>

          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {columns &&
                  columns.map(column => (
                    <tr key={column.id}>
                      <td>{column.name}</td>
                      <td>{column.type}</td>
                      <td>{column.comment}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default PartitionColumns;
