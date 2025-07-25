import { FC, ReactElement, useEffect } from 'react';
import { useGraphQL } from './useGraphQL';
import { ApolloProvider } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { Loader } from '../../components/Loader';
import { toastMessage } from '../../utils';

interface Props {
  children: ReactElement;
}

const GraphQLProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const { error, loading, client } = useGraphQL();

  useEffect(() => {
    if (error) {
      toastMessage(dispatch, JSON.stringify(error?.message), 'error');
    }
  }, [error]);

  if (loading) return <Loader text="Loading..." />;

  return (
    <>{client && <ApolloProvider client={client}>{children}</ApolloProvider>}</>
  );
};

export default GraphQLProvider;
