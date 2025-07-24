import StatsD from 'hot-shots';
// import {DD_ENV, NODE_ENV, DD_AGENT_HOST, DD_DOGSTATSD_PORT} from '../configs';
import {createLogger, format} from 'winston';
import httpContext from 'express-http-context';

export const formatLog = format(info => {
  const params = {
    ...info,
    reqId: httpContext.get('reqId') || '',
    // ddtags: [`source:winston, DD_ENV:${DD_ENV}`],
  };
  return params;
});

export const loggerConfig = {
  // transports: [
  //   NODE_ENV !== 'production'
  //     ? new transports.Console({
  //         format: format.combine(
  //           format.timestamp(),
  //           format.errors({stack: true}),
  //           formatLog(),
  //           format.colorize(),
  //           format.prettyPrint()
  //         ),
  //         // silent: NODE_ENV === 'test',
  //       })
  //     : new transports.Console({
  //         format: format.combine(
  //           format.timestamp(),
  //           format.errors({stack: true}),
  //           formatLog(),
  //           format.json()
  //         ),
  //       }),
  // ],
};

export const logger = createLogger(loggerConfig);

const statsDConfig = {
  // host: DD_AGENT_HOST,
  // port: Number(DD_DOGSTATSD_PORT),
  // prefix: 'dnade.metastore_ui.',
  // errorHandler: (err: Error) => logger.error(err),
  // globalTags: ['source:statsd', `DD_ENV:${DD_ENV}`],
};

export const statsD = new StatsD(statsDConfig);
