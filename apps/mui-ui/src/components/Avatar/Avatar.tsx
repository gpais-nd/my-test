import {
  ComponentPropsWithoutRef,
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { User } from '../../types/user.types';
import styles from './Avatar.module.scss';
import UserIcon from './images/UserIcon';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface Props extends ComponentPropsWithoutRef<'div'> {
  user: User;
  onLogOut: () => void;
}

const Avatar: FC<Props> = ({ user, onLogOut, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.avatar} ref={menuRef}>
      <div
        className={styles.avatarImage}
        {...props}
        onClick={handleAvatarClick}
      >
        {user.personalInfo?.image ?? <UserIcon />}
      </div>
      {isOpen && user.personalInfo && (
        <div className={styles.avatarMenu}>
          <div className={styles.user}>{user.personalInfo.email}</div>
          <a className={styles.logout} onClick={onLogOut}>
            <LogoutOutlinedIcon fontSize="small" />
            Log out
          </a>
        </div>
      )}
    </div>
  );
};

export default Avatar;
