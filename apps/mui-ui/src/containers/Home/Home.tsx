import { Landing } from 'components/Landing';
import { Loader } from 'components/Loader';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSources } from 'sideEffects/actions/app.actions';
import { RootState } from 'sideEffects/reducers';
import styles from './Home.module.scss';
import { useGetDatadogToken } from '../../hooks/useAwsRequests';
import DownloadsSidebar from 'containers/Downloads/DownloadsSidebar';

const Home = () => {
  const dispatch = useDispatch();
  const dataSources = useSelector((state: RootState) => state.app.dataSources);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    useGetDatadogToken(user.personalInfo?.email);
    dispatch(fetchDataSources());
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className={styles.container} style={{ flex: 3 }}>
        {dataSources.length > 0 ? (
          <Landing dataSources={dataSources} />
        ) : (
          <Loader text="Loading Data Sources" />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <DownloadsSidebar />
      </div>
    </div>
  );
};

export default Home;
