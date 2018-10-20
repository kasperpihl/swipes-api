import 'src/polyfills/asyncSupport';
import 'src/polyfills/uncaughtException';
import 'src/polyfills/errorPrototypes';

import http from 'http';
import express from 'express';

import redis from 'redis';

import corsHandler from 'src/middlewares/corsHandler';

import errorSwipes from 'src/middlewares/error/errorSwipes';
import errorHandler from 'src/middlewares/error/errorHandler';
import socketSetup from 'src/utils/socket/socketSetup';

// process.env.PORT - this is set by default from elastic beanstalk
const port = process.env.PORT || 7000;
const app = express();

app.use(corsHandler);

app.use('/test', (req, res) => {
  const pub = redis.createClient({
    // url: 'ws-redis-staging.zfbm04.0001.use1.cache.amazonaws.com',
  });
  pub.publish(
    'global',
    JSON.stringify({
      type: 'forceDisconnect'
    })
  );
  pub.quit();
  res.send('published');
});

app.use(errorSwipes);
app.use(errorHandler);

const server = http.createServer(app);
socketSetup(server);

server.listen(port);
console.log('websocket started on port %s', port);
