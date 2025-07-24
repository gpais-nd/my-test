import {formatLog} from '../logger';
import expressWinston from 'express-winston';
import {format, transports} from 'winston';
// import {NODE_ENV} from '../configs';
//const NODE_ENV = 'production' || 'test';
const NODE_ENV = process.env.NODE_ENV === 'test' ? 'test' : 'production';

export const errorLogger = expressWinston.errorLogger({
  transports: [
    NODE_ENV !== 'production'
      ? new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
          silent: NODE_ENV === 'test',
        })
      : new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.errors({stack: true}),
            formatLog(),
            format.json()
          ),
        }),
  ],
  meta: true,
});

export const routeLogger = expressWinston.logger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.errors({stack: true}),
        formatLog(),
        format.json()
      ),
    }),
  ],
  meta: true,
  expressFormat: true,
  responseWhitelist: ['statusCode'],
  requestWhitelist: ['body', 'headers', 'method', 'url', 'query'],
  headerBlacklist: ['cookie'],
  bodyWhitelist: ['operationName', 'variables'],
});
