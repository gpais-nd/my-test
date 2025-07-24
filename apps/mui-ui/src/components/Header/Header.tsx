import { FC } from 'react';
import styles from './Header.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DisneyTechLogo } from 'assets/brands-logos/DisneyTechLogo';
import { RootState } from '../../sideEffects/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { revokeAccessToken } from '../../sideEffects/actions/auth.actions';
import { Avatar } from '../Avatar';
import HelpMenu from './HelpMenu/HelpMenu';

const HEADER_TYPE_REGEX = /^\/ds\/[A-Za-z_$][A-Za-z0-9_$]*$|^\/$/;

const Header: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const handleLogOut = (): void => {
    dispatch(revokeAccessToken());
    navigate('/login');
  };

  return (
    <div
      data-testid="pageHeader"
      className={`${styles.header} ${
        styles[
          HEADER_TYPE_REGEX.test(location.pathname) ? 'primary' : 'secondary'
        ]
      }`}
    >
      <Link className={styles.homeLink} to="/">
        <DisneyTechLogo />
      </Link>
      {user.personalInfo && (
        <>
          <HelpMenu />
          <div className={styles.avatarContainer}>
            <Avatar user={user} onLogOut={handleLogOut} />
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
