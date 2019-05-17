import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';
import 'src/utils/aws/awsSetup';

import http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { setupLogger } from 'src/utils/logger';

import tokenCheck from 'src/utils/token/tokenCheck';
import checkUpdates from 'src/middlewares/checkUpdates';
import fetchConfig from 'src/middlewares/fetchConfig';
import redirectToStaging from 'src/middlewares/redirectToStaging';
import corsHandler from 'src/middlewares/corsHandler';

import errorHandler from 'src/middlewares/errorHandler';
import endpoints from 'src/endpoints/endpoints';

setupLogger('api');

// Elastic beanstalk passes env.PORT to forward nginx...
const port = Number(process.env.PORT || 5000);

const app = express();

if (fs.existsSync(path.join(__dirname, './public'))) {
  // In production when we have a public folder, serve statics
  app.use(express.static(path.join(__dirname, './public')));
  app.use('/', function(req, res, next) {
    // Serve index.html if not /v1 endpoint.
    if (req.path.startsWith('/v1')) {
      return next();
    }
    res.sendFile('index.html', {
      root: __dirname + '/public/'
    });
  });
}

app.use(corsHandler);

// If Content-Type is application/json, parse as json
app.use('/v1', (req, res, next) => {
  if (/application\/json/g.test(req.header('Content-Type'))) {
    bodyParser.json()(req, res, next);
  } else {
    next();
  }
});

// Get the config table into res.locals.config
app.use('/v1', fetchConfig);

// Redirect to staging (used when pushing apps before approval)
app.use('/v1', redirectToStaging);

// Ensure maintenance is respected
app.use('/v1', async (req, res, next) => {
  if (
    res.locals.config.flags.maintenance &&
    !req.header('Bypass-Maintenance')
  ) {
    throw Error('maintenance').toClient();
  }
  return next();
});

// Checking for updates
app.use('/v1', checkUpdates);

// Not authed routes goes here
app.use('/v1', endpoints.notAuthed);

// Validation of user's token
app.use('/v1', async (req, res, next) => {
  let token = req.header('Authorization');
  token = token && token.substr(7);

  res.locals.user_id = await tokenCheck(token);
  return next();
});

// Run all authenticated endpoints
app.use('/v1', endpoints.authed);

// Send 404 if no endpoint was found
app.use('/v1', (req, res) => {
  throw Error('Not found')
    .code(404)
    .toClient();
});

// Error handler
app.use(errorHandler);

const server = http.createServer(app);

// start api rest server
server.listen(port);

console.log('server started on port %s ' + new Date().toISOString(), port);
