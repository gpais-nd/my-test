import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  refreshAccessToken,
  revokeAccessToken,
} from '../../sideEffects/actions/auth.actions';
import { Loader } from '../../components/Loader';
import { RootState } from '../../sideEffects/reducers';
import { Outlet, useNavigate } from 'react-router-dom';
import { DAY_IN_MILLIS } from '../../utils/dateTime.utils';
import GraphQLProvider from '../../sideEffects/api/GraphQLProvider';

const AuthenticatedRoutes: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (
      !sessionStorage.getItem('code') &&
      !sessionStorage.getItem('sessionRevoked')
    ) {
      setLoading(true);
      const {
        REACT_APP_COGNITO_URL,
        REACT_APP_COGNITO_CLIENT_ID,
        REACT_APP_COGNITO_REDIRECT_URI,
      } = process.env;

      sessionStorage.setItem(
        'redirectURI',
        window.location.pathname + window.location.search
      );
      window.location.replace(
        `${REACT_APP_COGNITO_URL}/oauth2/authorize?response_type=code&client_id=${REACT_APP_COGNITO_CLIENT_ID}&redirect_uri=${REACT_APP_COGNITO_REDIRECT_URI}`
      );
    } else {
      setTimeout(() => {
        dispatch(revokeAccessToken());
      }, DAY_IN_MILLIS);
    }
  });

  useEffect(() => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      dispatch(refreshAccessToken(refreshToken));
    }
  }, []);

  useEffect(() => {
    if (
      !user.personalInfo &&
      sessionStorage.getItem('sessionRevoked') === 'true'
    ) {
      navigate('/login');
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Loader text="Authenticating..." />
      ) : (
        <GraphQLProvider>
          <Outlet />
        </GraphQLProvider>
      )}
    </>
  );
};

export default AuthenticatedRoutes;
