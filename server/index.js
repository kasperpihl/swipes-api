import http from 'http';
import express from 'express';
import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';
import websocketStart from './websocket';
import {
  authParseToken,
  authCheckToken,
} from './middlewares/jwt-auth-middleware';
import checkForUpdates from './middlewares/check-updates-middleware';
import handleJsonError from './middlewares/errors';
import {
  swipesErrorMiddleware,
} from './middlewares/swipes-error';
import * as routes from './api/routes';

require('winston-loggly-bulk');

const logglyConfig = config.get('loggly');
const env = config.get('env');
const transports = [];

if (env !== 'dev') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  expressWinston.requestWhitelist.push('locals');
  expressWinston.responseWhitelist.push('locals');

  transports.push(new winston.transports.Loggly({
    subdomain: logglyConfig.subdomain,
    token: logglyConfig.token,
    tags: [logglyConfig.tags],
    json: true,
  }));

  winston.add(winston.transports.Loggly, {
    token: logglyConfig.token,
    subdomain: logglyConfig.subdomain,
    tags: [logglyConfig.tags],
    json: true,
  });
}

const port = Number(config.get('apiPort') || 5000);
const app = express();

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Range, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  exposedHeaders: 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
}));

if (env !== 'dev') {
  app.use(expressWinston.logger({
    transports,
  }));
}

app.use('/workflows', express.static(`${__dirname}/../workflows`));

// Webhooks route
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }) /* routes.webhooksNotAuthed*/);

// Everything for v1 path is parsed as json
app.use('/v1', bodyParser.json(), handleJsonError);
// Merge req.query and req.body into req.params
app.use('/v1', (req, res, next) => {
  res.locals = Object.assign({}, req.params, req.query, req.body, res.locals, { returnObj: {} });
  return next();
});
// No authed routes goes here
app.use('/v1', routes.v1NotAuthed);
// Checking for updates
app.use('/v1', checkForUpdates);
// Validation of user's token
app.use('/v1', authParseToken, authCheckToken);
// Authed routes goes here
app.use('/v1', routes.v1Authed);

// // ========================================================================
// // Error handlers / they should be at the end of the middleware stack
// // ========================================================================
if (env !== 'dev') {
  app.use(expressWinston.errorLogger({
    transports,
  }));
}

const debugErrorHandling = (err, req, res, next) => {
  if (err && env === 'dev') {
    console.error(err);
  }

  return next(err);
};
const unhandledServerError = (err, req, res, next) => {
  if (err) {
    return res.status(500).send({ ok: false, err });
  }

  // Probably it will never hit this! :D
  return next();
};

if (env === 'dev') {
  app.use(debugErrorHandling);
}
app.use(swipesErrorMiddleware);
app.use(unhandledServerError);

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', (err) => {
  if (env !== 'dev') {
    winston.log('fatal', err);
  } else {
    console.error(err);
  }
  process.exit(1);
});

const server = http.createServer(app);

// start websocket server
websocketStart(server);

// start api rest server
server.listen(port);

console.log('server started on port %s', port);
