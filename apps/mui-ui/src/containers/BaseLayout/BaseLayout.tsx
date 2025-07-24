import { Outlet } from 'react-router-dom';
import css from './styles.module.scss';
import { Header } from 'components/Header';

function BaseLayout() {
  return (
    <div className={css.container}>
      <Header />
      <Outlet />
    </div>
  );
}

export default BaseLayout;
