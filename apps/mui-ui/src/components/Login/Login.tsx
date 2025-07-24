import { FC } from 'react';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

const Login: FC = () => {
  const sessionRevoked = sessionStorage.getItem('sessionRevoked');
  const navigate = useNavigate();

  const handleButtonClick = (): void => {
    sessionStorage.removeItem('sessionRevoked');
    navigate('/');
  };

  return (
    <div className={styles.login}>
      <h1>{sessionRevoked ? 'Session Closed' : 'Welcome to Metastore'}</h1>
      <p>
        {`${
          sessionRevoked ? 'Your session has been closed. ' : ''
        }Please click to continue.`}
      </p>
      <Button className={styles.button} onClick={handleButtonClick}>
        Login
      </Button>
    </div>
  );
};

export default Login;
