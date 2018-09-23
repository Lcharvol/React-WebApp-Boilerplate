import express from 'express';
import debug from 'debug';
import path from 'path';
import fs from 'fs';
import http from 'http';
import favicon from 'serve-favicon';
import compression from 'compression';
import { BUNDLE_ERROR } from '../constants/messages';

import { getUrl, bindError, bindCtx } from './utils.js';

const logger = debug('app:http');
const logerror = debug('app:http:error');

export const handler = (req, res) => {
  const file =
    req.url === '/bundle.js'
      ? '/../../../build/bundle.js'
      : '/../../../public/index.html';
  fs.readFile(__dirname + file, (err, data) => {
    if (err) {
      logerror(err);
      res.writeHead(500);
      return res.end(BUNDLE_ERROR);
    }
    res.writeHead(200);
    res.end(data);
  });
};

const init = ctx => {
  const { config } = ctx;
  const {
    publicPath,
    server: { port, host },
  } = config;
  const app = express();
  const httpServer = http.createServer(app);
  const promise = new Promise(resolve => {
    app
      .use(compression())
      .use(favicon(path.join(publicPath, '/favicon.ico')))
      .use(bindCtx(ctx))
      .use(bindError)
      .use('/ping', (req, res) => res.json({ ping: 'pong' }))
      .use('/', handler);

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
