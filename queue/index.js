import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import express from 'express';
import MiddlewareComposer from './middleware_composer';
import * as middlewares from './middlewares';
import {
  swipesErrorMiddleware,
  SwipesError,
} from './swipes-error';

const port = config.get('port');
const app = express();

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
}));

app.use('/health', (req, res) => {
  return res.status(200).json({});
});

app.use('/process', bodyParser.json(), (originalReq, originalRes, originalNext) => {
  const {
    event_type,
  } = originalReq.body;

  if (!middlewares[event_type]) {
    return originalNext(new SwipesError(`There is no event_type with the name - ${event_type}`));
  }

  const composer = new MiddlewareComposer(
    originalReq.body,
    ...middlewares[event_type],
    (req, res, next) => {
      return originalRes.status(200).json({ ok: true, res: res.locals });
    },
    (err, req, res, next) => {
      return originalNext(err);
    },
  );

  return composer.run();
});

app.use(swipesErrorMiddleware);

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', (err) => {
  console.error(`${(new Date()).toUTCString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});

const server = http.createServer(app);

server.listen(port);
console.log('queue is online');
