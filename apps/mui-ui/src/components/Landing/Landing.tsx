import { FC, useEffect, useState } from 'react';
import { DataSource } from 'types/entities.types';
import { WelcomeBanner } from '../WelcomeBanner';
import { DataSourceCards } from 'components/DataSourceCards';
import { Loader } from 'components/Loader';
import { useGetCountTables } from '../../containers/Home/controllers/useGetCountTables';
import { useDispatch } from 'react-redux';
import { clearToastMessages } from '../../sideEffects/actions/gui.actions';
import { Link } from '../../types/utils.types';

interface Props {
  dataSources: DataSource[];
}

const Landing: FC<Props> = ({ dataSources }) => {
  const dispatch = useDispatch();
  const { loading, tablesCounting } = useGetCountTables(dataSources);
  const [dataSourcesWithCount, setDataSourcesWithCount] = useState<
    DataSource[]
  >([]);
  const links: Link[] =
    process.env.REACT_APP_ENVIRONMENT === 'production' ||
    process.env.REACT_APP_ENVIRONMENT === 'dev'
      ? []
      : [
          {
            text: 'Pipelines',
            href: '/pipelines',
          },
        ];

  links.push({
    text: 'Snowflake Analytics',
    href:
      process.env.REACT_APP_SF_ANALYTICS_LINK ||
      'https://analytics.oms.disn.io/',
  });

  useEffect(() => {
    dispatch(clearToastMessages());
  }, []);

  useEffect(() => {
    if (dataSources) {
      setDataSourcesWithCount(
        dataSources.map(dataSource => ({
          ...dataSource,
          numberOfTables: tablesCounting[dataSource.name],
        }))
      );
    }
  }, [dataSources, tablesCounting]);

  return (
    <>
      <WelcomeBanner />
      {loading ? (
        <Loader text="Loading Data Sources" />
      ) : (
        <DataSourceCards dataSources={dataSourcesWithCount} links={links} />
      )}
    </>
  );
};

export default Landing;
