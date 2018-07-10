import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';

import config from 'config';

import bodyParser from 'body-parser';
import http from 'http';
import express from 'express';
import MiddlewareComposer from 'src/_legacy-queue/middleware_composer';
import * as middlewares from 'src/_legacy-queue/middlewares';
import jobs from 'src/jobs/jobs';

import corsHandler from 'src/middlewares/corsHandler';
import errorSwipes from 'src/middlewares/error/errorSwipes';
import errorHandler from 'src/middlewares/error/errorHandler';

const env = config.get('env');
// process.env.PORT - this is set by default from elastic beanstalk
const port = process.env.PORT || config.get('queuePort');
const app = express();

app.use(corsHandler);

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

app.use('/process', jobs);

app.use(errorSwipes);
app.use(errorHandler);

const server = http.createServer(app);

server.listen(port);
console.log('queue started on port %s', port);