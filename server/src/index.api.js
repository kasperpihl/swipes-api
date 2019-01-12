import http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { setupLogger } from 'src/utils/logger';
import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';

import tokenCheck from 'src/utils/token/tokenCheck';
import checkUpdates from 'src/middlewares/checkUpdates';
import fetchConfig from 'src/middlewares/fetchConfig';
import redirectToStaging from 'src/middlewares/redirectToStaging';
import corsHandler from 'src/middlewares/corsHandler';

import errorHandler from 'src/middlewares/errorHandler';
import endpoints from 'src/endpoints/endpoints';
import tokenCheck from './utils/token/tokenCheck';

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
    res.sendfile('public/index.html');
  });
}

app.use(corsHandler);

// Everything on v1 path (which is not multipart form data) is parsed as json
app.use('/v1', bodyParser.json(), (err, req, res, next) => {
  // Malformed JSON error handler
  res.status(400).send({ ok: false, error: 'Invalid json.' });
});
// Merge req.query and req.body into req.params
app.use('/v1', (req, res, next) => {
  res.locals = Object.assign({}, req.params, req.query, req.body, res.locals);
  return next();
});
// Get the config table into res.locals.config
// app.use('/v1', fetchConfig);
// app.use('/v1', redirectToStaging);
// No authed routes goes here
app.use('/v1', endpoints.notAuthed);
// Checking for updates
// app.use('/v1', checkUpdates);

// Validation of user's token
app.use('/v1', async (req, res, next) => {
  res.locals.user_id = await tokenCheck(res.locals.token);
  return next();
});

app.use('/v1', endpoints.authed);

app.use('/v1', (req, res) => {
  res.sendStatus(404);
});
// ========================================================================
// Error handlers / they should be at the end of the middleware stack
// ========================================================================

app.use(errorHandler);

const server = http.createServer(app);

// start api rest server
server.listen(port);

console.log('server started on port %s', port);
