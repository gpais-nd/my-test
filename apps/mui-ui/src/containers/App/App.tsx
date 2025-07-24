import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import ScrollToTop from './ScrollToTop';
import { Loader } from 'components/Loader';
import TablesList from 'containers/TablesList';
import { ToastMessages } from 'components/ToastMessages';
import { AuthenticatedRoutes, OIDCRedirect } from '../Auth';
import Login from '../../components/Login';
import NotFound from '../../components/NotFound';
import store from '../../sideEffects/store';
import Pipelines from '../Pipelines/Pipelines';
import LineagePage from '../LineagePage/LineagePage';
import DownloadsPage from 'containers/Downloads/DownloadsPage';

const HomeRoute = lazy(() => import('./HomeRoute'));
const TableDetails = lazy(() => import('../TableDetails'));
const BaseLayout = lazy(() => import('../BaseLayout'));

const App = () => {
  return (
    <Provider store={store}>
      <ToastMessages />
      <Suspense fallback={<Loader />}>
        <ScrollToTop />
        <Routes>
          <Route element={<BaseLayout />} path="/">
            <Route element={<AuthenticatedRoutes />} path="/">
              <Route element={<HomeRoute />} index path="/" />
              <Route element={<Pipelines />} index path="/pipelines" />
              <Route element={<DownloadsPage />} index path="/downloads" />
              <Route
                element={<LineagePage />}
                index
                path="/lineage/:dataSourceName/:tableId"
              />
              <Route path="/dataSource">
                <Route path=":dataSource" element={<TablesList />} />
                <Route
                  path="/dataSource/:dataSource/database/:databaseName/asset/:tableId/lineage"
                  element={<TableDetails />}
                />
                <Route
                  path="/dataSource/:dataSource/database/:databaseName/asset/:tableId/*"
                  element={<TableDetails />}
                />
              </Route>
            </Route>
            <Route element={<NotFound />} path="*" />
            <Route element={<NotFound />} path="/notFound" />
            <Route element={<Login />} index path="/login" />
          </Route>
          <Route element={<OIDCRedirect />} index path="/index.html" />
        </Routes>
      </Suspense>
    </Provider>
  );
};

export default App;
