import express from 'express';
import debug from 'debug';
import http from 'http';

import { getUrl } from './utils';

const logger = debug('http');
const logerror = debug('http:error');

const init = ctx => {
  const { config } = ctx;
  const {
    server: { port },
  } = config;
  const app = express();
  const httpServer = http.createServer(app);
  const promise = new Promise(resolve => {
    httpServer.listen(port, () => {
      console.log('httpServer: ', httpServer.address());
      httpServer.url = getUrl(httpServer);
      logger(`server started on ${httpServer.url}`);
      resolve({ ...ctx, http: httpServer });
    });
  });

  return promise;
};

export default init;
