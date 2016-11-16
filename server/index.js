"use strict";

import express from 'express';
import config from 'config';
import io from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import {
  restAuth,
  ioAuth
} from './middlewares/jwt-auth-middleware';
import {
  handleJsonError
} from './middlewares/errors';
import {
  swipesErrorMiddleware
} from './middlewares/swipes-error';

import * as routes from './api/routes'

const port = Number(config.get('apiPort') || 5000);
const app = express();
const apiServer = app.listen(port);
const ioServer = io.listen(apiServer);

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Accept, X-Requested-With, Session, Content-Length, X-Requested-With'
}));
app.use('/workflows', express.static(__dirname + '/../workflows'));

// Webhooks route
app.use('/webhooks', bodyParser.raw({type: 'application/json'}), routes.webhooksNotAuthed);

// Everything for v1 path is parsed as json
app.use('/v1', bodyParser.json(), handleJsonError);
// Merge req.query and req.body into req.params
app.use('/v1', (req, res, next) => {
  res.locals = Object.assign({}, req.params, req.query, req.body, res.locals);
  return next();
});
// No authed routes goes here
app.use('/v1', routes.v1NotAuthed);
// Validation of user's token
app.use('/v1', restAuth);
// Authed routes goes here
app.use('/v1', routes.v1Authed);

//
// // ===========================================================================================================
// // Require routes
// // ===========================================================================================================
// let usersAuth = require('./routes/users_signup_signin.js');
// let usersRouter = require('./routes/users.js');
// let rtmRouter = require('./routes/rtm.js');
// let searchRouter = require('./routes/search.js');
// let servicesRouter = require('./routes/services.js');
// let servicesNoAuthRouter = require('./routes/services_no_auth.js');
// let mentionsRouter = require('./routes/mentions.js');
// let workflowsRouter = require('./routes/workflows.js');
// let linksRouter = require('./routes/links.js');
// let feedbackRouter = require('./routes/feedback.js');
// let feedbackNoAuthRouter = require('./routes/feedback_no_auth.js');
// let shareRender = require('./routes/share_render.js');
// let shareNoAuthRouter = require('./routes/share_no_auth.js');
// let webhooksRouter = require('./routes/webhooks.js');
// let goalsRouter = require('./routes/goals.js');
// let stepsRouter = require('./routes/steps.js');
//
// // Log out any uncaught exceptions, but making sure to kill the process after!
// process.on('uncaughtException', (err) => {
// 	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
// 	console.error(err.stack)
// 	process.exit(1)
// });
//
// // ===========================================================================================================
// // Routes
// // ===========================================================================================================
//
// app.route('/').get((req,res,next) => {
// 	res.send('Swipes synchronization services - online');
// });
// // Routes for which we don't need authentication
// app.use('/webhooks', bodyParser.raw({type: 'application/json'}), webhooksRouter);
// app.use('/s', shareRender);
//
// // Everything going on /v1 is parsed as json
// app.use('/v1', bodyParser.json(), jsonParseErrorHandler);
// app.use('/v1', shareNoAuthRouter);
// app.use('/v1', usersAuth);
// app.use('/v1', servicesNoAuthRouter);
// app.use('/v1', feedbackNoAuthRouter);
//
// // Middleware to check if a valid token is provided from the user
// app.use('/v1', restAuth);
//
// // Routes for which we need authentication
// app.use('/v1', usersRouter);
// app.use('/v1', rtmRouter);
// app.use('/v1', searchRouter);
// app.use('/v1', servicesRouter);
// app.use('/v1', mentionsRouter);
// app.use('/v1', workflowsRouter);
// app.use('/v1', linksRouter);
// app.use('/v1', feedbackRouter);
// app.use('/v1', goalsRouter);
// app.use('/v1', stepsRouter);
//
// // We want req.userId to the socket.io stuff too
// io.use((socket, next) => {
//   ioAuth(socket.request, socket.request.res, next);
// })
//
// // require our socketio module and pass the io instance
// require('./socketio/socketio.js')(io);
//
// // ===========================================================================================================
// // Error handlers / they should be at the end of the middleware stack
// // ===========================================================================================================
//
const logErrors = (err, req, res, next) => {
  // We can use some service like loggy to log errors
  if (err) {
    console.error(err);
    return next(err);
  }

  return next();
}
//
const unhandledServerError = (err, req, res, next) => {
  if (err) {
    return res.status(500).send({ err: err });
  }

  // Probably it will never hit this! :D
  return next();
}

app.use(logErrors);
app.use(swipesErrorMiddleware);
app.use(unhandledServerError);

console.log('server started on port %s', port);
