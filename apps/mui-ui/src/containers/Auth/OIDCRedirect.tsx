import { FC, useEffect } from 'react';
import { Loader } from '../../components/Loader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../../sideEffects/actions/auth.actions';

const OIDCRedirect: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const storedCode = searchParams.get('code');
    if (storedCode) {
      sessionStorage.setItem('code', storedCode);
      dispatch(getAccessToken(storedCode));
    } else {
      navigate('/notFound');
    }
    navigate(`${sessionStorage.getItem('redirectURI')}`);
  }, []);

  return <Loader text="Authenticating..." />;
};

export default OIDCRedirect;
