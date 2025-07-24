import { FC, useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import styles from './HelpMenu.module.scss';

const reportLink = process.env.REACT_APP_JIRA_ISSUES_REPORT_LINK;

const HelpMenu: FC = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const getBasePath = () => {
    const reporter = '&labels=oms_user_reported';
    const env = `&labels=env:${process.env.REACT_APP_ENVIRONMENT}`;

    return `${reportLink}${reporter}${env}&priority=3`;
  };

  const requestAFeatureHandler = () => {
    window.open(
      `${getBasePath()}&issuetype=10101`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const reportABugHandler = () => {
    window.open(
      `${getBasePath()}&issuetype=10206`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className={styles.help} ref={menuRef}>
      <IconButton onClick={reportABugHandler}>
        <Tooltip title="Report a bug">
          <BugReportOutlinedIcon className={styles.icon} />
        </Tooltip>
      </IconButton>
      <IconButton onClick={requestAFeatureHandler}>
        <Tooltip title="Request a feature">
          <AddToQueueIcon className={styles.icon} />
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default HelpMenu;
