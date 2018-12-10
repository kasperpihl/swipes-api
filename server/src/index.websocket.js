import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';

import http from 'http';
import express from 'express';

import corsHandler from 'src/middlewares/corsHandler';

import errorSwipes from 'src/middlewares/error/errorSwipes';
import errorHandler from 'src/middlewares/error/errorHandler';
import socketSetup from 'src/utils/socket/socketSetup';

// process.env.PORT - this is set by default from elastic beanstalk
const port = process.env.PORT || 7000;
const app = express();

app.use(corsHandler);

app.use(errorSwipes);
app.use(errorHandler);

const server = http.createServer(app);
socketSetup(server);

server.listen(port);
console.log('websocket started on port %s', port);
