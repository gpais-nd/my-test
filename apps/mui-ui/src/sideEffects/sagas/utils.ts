import {
  AuthTokensResponse,
  JWTObject,
  RequestOptions,
} from '../../types/api.types';
import { User } from '../../types/user.types';

export const requestOptions: RequestOptions = {
  method: 'post',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  crossOrigin: true,
};

const parseJSON = (response: Response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response
    .clone()
    .json()
    .catch(() => response.status);
};

export const parseJwt = (token: string): JWTObject => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');

  return JSON.parse(window.atob(base64));
};

export const parseUserFromJwt = (JWTObject: JWTObject): User => {
  const customRoles = JWTObject['custom:roles'];

  const user: User = {
    personalInfo: {
      profile: JWTObject.profile,
      name: JWTObject.name,
      email: JWTObject.email,
      sub: JWTObject.sub,
    },
    roles: customRoles
      ? typeof customRoles === 'string'
        ? JSON.parse(customRoles)
        : customRoles
      : [],
  };
  return user;
};

export const updateSessionStorage = (response: AuthTokensResponse): void => {
  const JWTObject = parseJwt(response.id_token);
  const user = parseUserFromJwt(JWTObject);
  sessionStorage.setItem('roles', JSON.stringify(user.roles));
  sessionStorage.setItem('idToken', response.id_token);
  sessionStorage.setItem('refreshToken', response.refresh_token);
  sessionStorage.setItem('expiresIn', response.expires_in.toString());
  sessionStorage.removeItem('sessionRevoked');
};

export const clearSessionStorage = (): void => {
  sessionStorage.removeItem('code');
  sessionStorage.removeItem('redirectURI');
  sessionStorage.removeItem('roles');
  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('expiresIn');
  sessionStorage.setItem('sessionRevoked', 'true');
};

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  //@ts-ignore
  error.response = response;
  throw error;
}

export const request = async (url: string, requestOptions: RequestOptions) => {
  return fetch(url, requestOptions).then(checkStatus).then(parseJSON);
};
