import express from 'express';
import {log} from './logger/log';

const app = express();

console.log('==> STARTING APP');
log('Application started!');

app.use((req, res, next) => {
  // Log every request
  log(`Request received: ${req.method} ${req.url}`);
  next();
});

export default app;
