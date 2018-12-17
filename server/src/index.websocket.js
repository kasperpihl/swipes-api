import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';

import http from 'http';
import express from 'express';
import config from 'config';
import websocketStart from './websocket';

import corsHandler from 'src/middlewares/corsHandler';

import errorHandler from 'src/middlewares/error/errorHandler';

const port = Number(config.get('apiPort') || 5000);
const app = express();

app.use(corsHandler);

// ========================================================================
// Error handlers / they should be at the end of the middleware stack
// ========================================================================

app.use(errorHandler);

const server = http.createServer(app);

// start websocket server
websocketStart(server);

console.log('websocket started on port %s', port);
