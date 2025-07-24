import { FC } from 'react';
import WelcomeImage from './images/WelcomeImage';
import styles from './WelcomeBanner.module.scss';

const WelcomeBanner: FC = () => (
  <div className={styles.welcomeBanner}>
    <WelcomeImage />
    <div className={styles.welcomeMessage}>
      <div className={styles.welcomeText}>Welcome to</div>
      <div className={styles.omsText}>Operational Metadata Store</div>
    </div>
  </div>
);

export default WelcomeBanner;
