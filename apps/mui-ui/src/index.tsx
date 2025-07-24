import React from 'react';
import App from './containers/App';
import ThemeSelector from './components/ThemeSelector';
import * as serviceWorker from './serviceWorker';
import { createRoot } from 'react-dom/client';
import {
  QueryParamProvider,
  transformSearchStringJsonSafe,
} from 'use-query-params';
import {
  BrowserRouter,
  useNavigate,
  useLocation,
  Location,
} from 'react-router-dom';
import './index-hulu.scss';
import 'typeface-roboto';

(async () => {
  const queryStringifyOptions = {
    transformSearchString: transformSearchStringJsonSafe,
  };

  const RouteAdapter = ({
    children,
  }: {
    children: (History: {
      history: any;
      location: Location;
    }) => React.ReactNode;
  }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const adaptedHistory = React.useMemo(
      () => ({
        replace(location: Location) {
          navigate(location, { replace: true, state: location.state });
        },
        push(location: Location) {
          navigate(location, { replace: false, state: location.state });
        },
      }),
      [navigate]
    );
    return children({ history: adaptedHistory, location });
  };

  const container = document.getElementById('root');
  const root = createRoot(container!); // createRoot(container!) if you use TypeScript

  root.render(
    <BrowserRouter>
      <QueryParamProvider
        // @ts-ignore:
        ReactRouterRoute={RouteAdapter}
        stringifyOptions={queryStringifyOptions}
      >
        <ThemeSelector isDark={false}>
          <App />
        </ThemeSelector>
      </QueryParamProvider>
    </BrowserRouter>
  );
})();

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
