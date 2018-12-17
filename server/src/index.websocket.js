import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';

import http from 'http';
import express from 'express';
import { setupLogger } from 'src/utils/logger';
import corsHandler from 'src/middlewares/corsHandler';

import errorHandler from 'src/middlewares/error/errorHandler';
import socketSetup from 'src/utils/socket/socketSetup';

setupLogger('websocket');

// process.env.PORT - this is set by default from elastic beanstalk
const port = process.env.PORT || 7000;
const app = express();

app.use(corsHandler);

app.use(errorHandler);

const server = http.createServer(app);
socketSetup(server);

server.listen(port);
console.log('websocket started on port %s', port);
