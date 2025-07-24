import { ApolloError } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forceRefreshAccessToken } from '../actions/auth.actions';
import { toastMessage } from '../../utils';

interface ApolloErrorHandlerInterface {
  apolloErrorHandler: (error: ApolloError) => void;
}

interface NetworkError {
  result: {
    errors: {
      errorType: string;
    }[];
  };
}

export const useApolloErrorHandler = (): ApolloErrorHandlerInterface => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apolloErrorHandler = (error: ApolloError): void => {
    const networkError: NetworkError =
      error.networkError as unknown as NetworkError;

    try {
      if (networkError.result) {
        networkError.result.errors.forEach(error => {
          if (error.errorType === 'AuthorizerFailureException') {
            console.log('Refreshing token due invalid JWT');

            const refreshToken = sessionStorage.getItem('refreshToken');
            if (refreshToken) {
              dispatch(forceRefreshAccessToken(refreshToken));
            } else {
              navigate('/login');
            }
          }
        });
      }
    } catch (e) {
      if (error?.graphQLErrors) {
        error?.graphQLErrors.forEach(graphQLError => {
          toastMessage(dispatch, graphQLError.message, 'error', undefined);
        });
      }
    }
  };

  return {
    apolloErrorHandler,
  };
};
