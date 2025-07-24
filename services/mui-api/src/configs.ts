// import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

/**
 * Thanks to Stack Overflow, Shakeel Nov 6 '18 at 22:42. A gorgeous solution to resolve 'string | undefined'
 * TypeScript problem for process.env variables, which was really a pain in the.
 */
declare let process: {
  env: {
    [key: string]: string;
  };
};

// System env variables
// export const {NODE_ENV, PORT, DD_AGENT_HOST, DD_DOGSTATSD_PORT} = process.env;

// Vault configs and user defined env variables
// let vaultConfigs: any = {};
// if (process.env.VAULT_K8S_MOUNT) {
//   try {
//     // @ts-ignore: allow init container location if inside k8s
//     // vaultConfigs = require('/shared/config/application-vault.json');
//   } catch (e) {
//     console.error(e);
//   }
// }

export const {
  DD_ENV = 'vaultConfigs.DD_ENV',
  LD_SDK_KEY = 'vaultConfigs.LD_SDK_KEY',
  APP_URL = 'vaultConfigs.APP_URL',
  METASTORE_LEGACY_GQL_API_URL = 'vaultConfigs.METASTORE_LEGACY_GQL_API_URL',
  COGNITO_URL = 'vaultConfigs.COGNITO_URL',
} = process.env;

console.info('COGNITO_URL :: ', COGNITO_URL);

export const launchDarklyClientMock = {
  // variation: () => true,
  // waitForInitialization: () => Promise.resolve(),
};

export const launchDarklyClient = '';
// NODE_ENV !== 'test' && NODE_ENV !== undefined
//   ? LaunchDarkly.init(LD_SDK_KEY)
//   : launchDarklyClientMock;
