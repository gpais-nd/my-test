import { datadogRum } from '@datadog/browser-rum';

export function startDatadog(
  clientToken: string,
  userEmail: string | undefined
) {
  datadogRum.init({
    applicationId: process.env.REACT_APP_DATADOG_ID || '',
    clientToken: clientToken,
    site: 'datadoghq.com',
    service: 'oms-ui',
    env: process.env.REACT_APP_DATADOG_ENV,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    silentMultipleInit: true,
    trackViewsManually: false,
  });

  if (userEmail) {
    datadogRum.setUser({
      email: userEmail,
      name: userEmail,
      id: userEmail,
    });
  }
}
