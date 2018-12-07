import http from 'http';
import express from 'express';
import path from 'path';
import config from 'config';
import bodyParser from 'body-parser';
import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';
import authParseToken from 'src/middlewares/auth/authParseToken';
import authCheckToken from 'src/middlewares/auth/authCheckToken';
import authCheckIfPartOfOrganization from 'src/middlewares/auth/authCheckIfPartOfOrganization';
import checkUpdates from 'src/middlewares/checkUpdates';
import fetchConfig from 'src/middlewares/fetchConfig';
import redirectToStaging from 'src/middlewares/redirectToStaging';
import corsHandler from 'src/middlewares/corsHandler';
import logToAws from 'src/middlewares/logToAws';
import errorInvalidJson from 'src/middlewares/error/errorInvalidJson';
import errorSwipes from 'src/middlewares/error/errorSwipes';
import errorHandler from 'src/middlewares/error/errorHandler';
import * as routes from 'src/_legacy-api/routes';
import endpoints from 'src/endpoints/endpoints';
import websocketStart from './websocket';

const port = Number(config.get('apiPort') || 5000);
const app = express();

if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist/public')));
}

app.use(corsHandler);

// Webhooks route
app.use(
  '/webhooks',
  bodyParser.raw({ type: 'application/json' }) /* routes.webhooksNotAuthed */
);

app.use('/v1', routes.v1Multipart);

// Everything on v1 path (which is not multipart form data) is parsed as json
app.use('/v1', bodyParser.json(), errorInvalidJson);
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

// Logging input to aws, including user id.
app.use(logToAws);

// Keeping old authed endpoints here, for not being sure if we rely on no org id.
app.use('/v1', routes.v1Authed);

// Endpoints that needs to be authed, but not part of an org.
app.use('/v1', endpoints.noOrg);

// Ensure that organization_id passed is valid
app.use('/v1', authCheckIfPartOfOrganization);

// Authed routes goes here (with org)
app.use('/v1', endpoints.authed);

// ========================================================================
// Error handlers / they should be at the end of the middleware stack
// ========================================================================

app.use(errorSwipes);
app.use(errorHandler);

const server = http.createServer(app);

// start websocket server
websocketStart(server);

// start api rest server
server.listen(port);

console.log('server started on port %s', port);
