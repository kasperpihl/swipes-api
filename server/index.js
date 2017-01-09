import http from 'http';
import express from 'express';
import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import websocketStart from './websocket';
import restAuth from './middlewares/jwt-auth-middleware';
import handleJsonError from './middlewares/errors';
import {
  swipesErrorMiddleware,
} from './middlewares/swipes-error';
import * as routes from './api/routes';

const port = Number(config.get('apiPort') || 5000);
const app = express();

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
}));
app.use('/workflows', express.static(`${__dirname}/../workflows`));

// Webhooks route
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }), routes.webhooksNotAuthed);

// Everything for v1 path is parsed as json
app.use('/v1', bodyParser.json(), handleJsonError);
// Merge req.query and req.body into req.params
app.use('/v1', (req, res, next) => {
  res.locals = Object.assign({}, req.params, req.query, req.body, res.locals, { returnObj: {} });
  return next();
});
// No authed routes goes here
app.use('/v1', routes.v1NotAuthed);
// Validation of user's token
app.use('/v1', restAuth);
// Authed routes goes here
app.use('/v1', routes.v1Authed);

// // ========================================================================
// // Error handlers / they should be at the end of the middleware stack
// // ========================================================================
const logErrors = (err, req, res, next) => {
  // We can use some service like loggy to log errors
  if (err) {
    console.error(err);
    return next(err);
  }

  return next();
};
//
const unhandledServerError = (err, req, res, next) => {
  if (err) {
    return res.status(500).send({ err });
  }

  // Probably it will never hit this! :D
  return next();
};

app.use(logErrors);
app.use(swipesErrorMiddleware);
app.use(unhandledServerError);

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', (err) => {
  console.error(`${(new Date()).toUTCString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});

const server = http.createServer(app);

// start websocket server
websocketStart(server);

// start api rest server
server.listen(port);

console.log('server started on port %s', port);
