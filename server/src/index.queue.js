import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';
import 'src/utils/aws/awsSetup';

import bodyParser from 'body-parser';
import http from 'http';
import express from 'express';
import endpoints from 'src/endpoints/endpoints';

import { setupLogger } from 'src/utils/logger';
import errorHandler from 'src/middlewares/errorHandler';

setupLogger('queue');
// process.env.PORT - this is set by default from elastic beanstalk
const port = process.env.PORT || 6000;
const app = express();

app.use('/health', (req, res) => {
  return res.sendStatus(200);
});

app.use('/process', bodyParser.json());

app.use('/process', endpoints.queue);

app.use(errorHandler);

const server = http.createServer(app);

server.listen(port);
console.log('queue started on port %s', port);
