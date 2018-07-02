import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtExceptions';

import http from 'http';
import express from 'express';
import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import websocketStart from './websocket';

import authParseToken from 'src/middlewares/auth/authParseToken';
import authCheckToken from 'src/middlewares/auth/authCheckToken'

import checkUpdates from 'src/middlewares/checkUpdates';
import fetchConfig from 'src/middlewares/fetchConfig';
import redirectToStaging from 'src/middlewares/redirectToStaging';

import errorJson from 'src/middlewares/error/errorJson';
import errorSwipes from 'src/middlewares/error/errorSwipes';
import errorUnhandledServer from 'src/middlewares/error/errorUnhandledServer';
import errorDebug from 'src/middlewares/error/errorDebug';

import * as routes from './api/routes';
import endpoints from './endpoints/endpoints';

const env = config.get('env');

const port = Number(config.get('apiPort') || 5000);
const app = express();

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Range, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  exposedHeaders: 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
}));

// Webhooks route
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }) /* routes.webhooksNotAuthed */);

app.use('/v1', routes.v1Multipart);

// Everything on v1 path (which is not multipart form data) is parsed as json
app.use('/v1', bodyParser.json(), errorJson);
// Merge req.query and req.body into req.params
app.use('/v1', (req, res, next) => {
  res.locals = Object.assign({}, req.params, req.query, req.body, res.locals);
  return next();
});
// Get the config table into res.locals.config
app.use('/v1', fetchConfig);
app.use('/v1', redirectToStaging);
// No authed routes goes here
app.use('/v1', endpoints.notAuthed);
app.use('/v1', routes.v1NotAuthed);
// Checking for updates
app.use('/v1', checkUpdates);
// Validation of user's token
app.use('/v1', authParseToken, authCheckToken);
// Logging input to aws
app.use(logToAws);
// Authed routes goes here
app.use('/v1', endpoints.authed);
app.use('/v1', routes.v1Authed);

// // ========================================================================
// // Error handlers / they should be at the end of the middleware stack
// // ========================================================================

if (env === 'dev') {
  app.use(debugErrorHandling);
}
app.use(errorSwipes);
app.use(errorUnhandledServer);

const server = http.createServer(app);

// start websocket server
websocketStart(server);

// start api rest server
server.listen(port);

console.log('server started on port %s', port);
