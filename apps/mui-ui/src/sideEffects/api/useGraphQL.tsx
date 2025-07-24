import { useEffect, useState } from 'react';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { RootState } from '../reducers';
import { useSelector } from 'react-redux';
import { setContext } from '@apollo/client/link/context';
import { Error } from '../../types/utils.types';

interface GraphQLInterface {
  error: Error | undefined;
  loading: boolean;
  client?: ApolloClient<NormalizedCacheObject>;
}

const { REACT_APP_GRAPHQL_ENDPOINT } = process.env;

export const useGraphQL = (): GraphQLInterface => {
  const tokenUpdateCounter = useSelector(
    (state: RootState) => state.app.tokenUpdateCounter
  );
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    try {
      const idToken = sessionStorage.getItem('idToken');

      if (idToken) {
        const httpLink = new HttpLink({
          uri: REACT_APP_GRAPHQL_ENDPOINT,
        });

        const authLink = setContext((_, { headers }) => {
          const token = idToken;
          return {
            headers: {
              ...headers,
              Authorization: `${token}`,
            },
          };
        });

        const link = ApolloLink.from([authLink, httpLink]);

        setClient(
          new ApolloClient({
            link,
            cache: new InMemoryCache(),
          })
        );
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [tokenUpdateCounter]);

  return {
    error,
    loading,
    client,
  };
};
