import { FC, ReactElement } from 'react';
import { ActionComponents } from 'components/ActionComponents';
import styles from './DetailsTitle.module.scss';
import { Breadcrumbs } from '../Breadcrumbs';

interface Props {
  title: string;
  dataSourceName: string;
  actions?: ReactElement[];
}

const DetailsTitle: FC<Props> = ({ title, dataSourceName, actions }) => {
  let decodedUri = title;

  try {
    decodedUri = decodeURI(title);
  } catch (error) {
    console.warn(error);
  }

  return (
    <div className={styles.detailsTitle}>
      <Breadcrumbs path={`/dataSource/${dataSourceName}`} />
      <div className={styles.title}>{decodedUri}</div>
      <ActionComponents
        className={styles.actionComponents}
        actionComponents={actions}
      />
    </div>
  );
};

export default DetailsTitle;
