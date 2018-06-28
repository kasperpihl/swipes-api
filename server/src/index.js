import http from 'http';
import express from 'express';
import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import websocketStart from './websocket';
import {
  authParseToken,
  authCheckToken,
} from './middlewares/jwt-auth-middleware';
import checkForUpdates from './middlewares/check-updates-middleware';
import getConfig from './middlewares/get-config';
import handleJsonError from './middlewares/errors';
import {
  SwipesError,
  swipesErrorMiddleware,
} from './middlewares/swipes-error';
import * as routes from './api/routes';
import endpoints from './endpoints/endpoints';

import logger from './logger';

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
app.use('/v1', bodyParser.json(), handleJsonError);
// Merge req.query and req.body into req.params
app.use('/v1', (req, res, next) => {
  res.locals = Object.assign({}, req.params, req.query, req.body, res.locals);
  return next();
});
// Get the config table into res.locals.config
app.use('/v1', getConfig);
app.use('/v1', (req, res, next) => {
  let shouldRedirect = false;

  if (res.locals.config.redirectToStaging) {
    Object.entries(res.locals.config.redirectToStaging).forEach(([header, rVal]) => {
      if (`${rVal}` === `${req.header(`sw-${header}`)}`) {
        shouldRedirect = true;
      }
    });
    if (shouldRedirect) {
      return res.redirect(307, `https://staging.swipesapp.com/v1${req.path}`);
    }
  }

  if (res.locals.config.maintenance) {
    return next(new SwipesError('maintenance', { maintenance: true }));
  }

  return next();
});
// No authed routes goes here
app.use('/v1', endpoints.notAuthed);
app.use('/v1', routes.v1NotAuthed);
// Checking for updates
app.use('/v1', checkForUpdates);
// Validation of user's token
app.use('/v1', authParseToken, authCheckToken);
// Logging input to aws
app.use((req, res, next) => {
  if(req.body) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const allowed = ['token', 'password', 'text', 'title'];
    const filteredBody = Object.keys(req.body)
      .filter(key => !allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: req.body[key],
        };
      }, {});

    logger.log('info', {
      ip,
      user_id: res.locals.user_id,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: filteredBody,
      route: req.originalUrl,
    });
  }

  return next();
});
// Authed routes goes here
app.use('/v1', endpoints.authed);
app.use('/v1', routes.v1Authed);

// // ========================================================================
// // Error handlers / they should be at the end of the middleware stack
// // ========================================================================

const debugErrorHandling = (err, req, res, next) => {
  if (err && env === 'dev') {
    console.error(err);
  }

  return next(err);
};
const unhandledServerError = (err, req, res, next) => {
  if (env !== 'dev') {
    logger.log('error', err);
  }
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
    logger.log('error', err);
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
