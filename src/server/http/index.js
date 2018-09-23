import express from 'express';
import debug from 'debug';
import http from 'http';

import { getUrl } from './utils.js';

const logger = debug('app:http');
const logerror = debug('app:http:error');

const init = ctx => {
  const { config } = ctx;
  const {
    server: { port, host },
  } = config;
  const app = express();
  const httpServer = http.createServer(app);
  const promise = new Promise(resolve => {
    httpServer.listen(port, host, () => {
      httpServer.url = getUrl(httpServer);
      logger(`Server started on ${httpServer.url}`);
      resolve({ ...ctx, http: httpServer });
    });
    httpServer.on('error', e => {
      if (e.code === 'EADDRINUSE') {
        logerror('Address in use, retrying...');
        setTimeout(() => {
          httpServer.close();
          httpServer.listen(port, host);
        }, 1000);
      }
    });
  });

  return promise;
};

export default init;
