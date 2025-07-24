import { FC } from 'react';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound: FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = (): void => {
    navigate('/');
  };

  return (
    <div className={styles.login}>
      <h1>{'Page not found'}</h1>
      <Button className={styles.button} onClick={handleButtonClick}>
        Back to Metastore
      </Button>
    </div>
  );
};

export default NotFound;
