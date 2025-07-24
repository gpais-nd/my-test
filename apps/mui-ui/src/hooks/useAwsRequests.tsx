import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  CognitoIdentityCredentials,
  fromCognitoIdentityPool,
} from '@aws-sdk/credential-provider-cognito-identity';
import { startDatadog } from 'sideEffects/services/Datadog';

const REGION = process.env.REACT_APP_GRAPHQL_REGION;
const IDENTITY_POOL_ID = process.env.REACT_APP_IDENTITY_POOL_ID || '';
const userPoolId = process.env.REACT_APP_USER_POOL_ID;
const secretName = process.env.REACT_APP_AWS_SECRET_NAME;
const secretKey = 'DATADOG_TOKEN';

async function fetchCredentials() {
  const idToken = window.sessionStorage.getItem('idToken') || '';
  try {
    const credentialsProvider = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${userPoolId}`]: idToken,
      },
    });
    const credentials = await credentialsProvider();
    return credentials;
  } catch (error) {
    console.error('Error fetching credentials:', error);
  }
}

async function fetchSecret(credentials: CognitoIdentityCredentials) {
  try {
    const secretsClient = new SecretsManagerClient({
      region: REGION,
      credentials,
    });
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsClient.send(command);

    if (response.SecretString) {
      const secret = JSON.parse(response.SecretString)[secretKey];
      return secret;
    }
  } catch (error) {
    console.error('Error fetching secret:', error);
  }
}

export const useGetDatadogToken = async (userEmail: string | undefined) => {
  const credentials = await fetchCredentials();
  if (credentials) {
    const token = await fetchSecret(credentials);
    if (token) {
      startDatadog(token, userEmail);
    }
  }
};

export async function downloadAssetFromS3(url: string, filename: string) {
  const credentials = await fetchCredentials();
  try {
    const { bucket, downloadKey } = getBucketAndKey(url);
    const s3Client = new S3Client({ region: REGION, credentials: credentials });
    const command = new GetObjectCommand({ Bucket: bucket, Key: downloadKey });
    const response = await s3Client.send(command);
    const blob = await response.Body?.transformToByteArray();
    if (blob) {
      const blobURL = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = blobURL;
      link.download = filename + '.xlsx';
      link.click();
      URL.revokeObjectURL(blobURL);
    }
  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error;
  }
}

export async function uploadAssetToS3(url: string, file: File) {
  const credentials = await fetchCredentials();
  try {
    const { bucket, downloadKey } = getBucketAndKey(url);
    const s3Client = new S3Client({ region: REGION, credentials: credentials });
    const arrayBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: downloadKey,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
    });
    await s3Client.send(command);
    console.log('File uploaded to S3 successfully');
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw error;
  }
}

function getBucketAndKey(url: string) {
  const s = url.split('/');
  const [bucket, downloadKey] = [s[2], s.splice(3).join('/')];
  return { bucket, downloadKey };
}
