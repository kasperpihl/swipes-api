import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';

import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import express from 'express';
import MiddlewareComposer from 'src/legacy-queue/middleware_composer';
import * as middlewares from 'src/legacy-queue/middlewares';
import jobs from 'src/jobs/jobs'; // Server folder

import SwipesError from 'src/utils/SwipesError';
import errorSwipes from 'src/middlewares/error/errorSwipes';
import errorUnhandledServer from 'src/middlewares/error/errorUnhandledServer';

const env = config.get('env');
// process.env.PORT - this is set by default from elastic beanstalk
const port = process.env.PORT || config.get('queuePort');
const app = express();

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
}));

app.use('/health', (req, res) => {
  return res.sendStatus(200);
});

app.use('/process', bodyParser.json())

app.use('/process', (originalReq, originalRes, originalNext) => {
  const {
    event_type,
  } = originalReq.body.payload;

  if (!middlewares[event_type]) {
    return originalNext();
    return originalNext(new SwipesError(`There is no event_type with the name - ${event_type}`));
  }

  const composer = new MiddlewareComposer(
    originalReq.body.payload,
    ...middlewares[event_type],
    (req, res, next) => {
      return originalRes.status(200).json({ ok: true, res: res.locals });
    },
    (err, req, res, next) => {
      console.log(originalReq.body.payload);
      return originalNext(err);
    },
  );

  return composer.run();
});

app.use('/process', jobs); // Imported from server/src/jobs folder

app.use(errorSwipes);
app.use(errorUnhandledServer);

const server = http.createServer(app);

server.listen(port);
console.log('queue started on port %s', port);
