import url from 'url';
import ws from 'ws';
import parseToken from 'src/utils/auth/parseToken';
import socketPongInterval from 'src/utils/socket/socketPongInterval';

import redis from 'redis';

export default server => {
  const wss = new ws.Server({ server });
  wss.on('connection', (socket, req) => {
    const parsedUrl = url.parse(req.url, true);
    const { token } = parsedUrl.query;
    let userId;
    const decodedToken = token && parseToken(token);
    if (decodedToken) {
      console.log(decodedToken);
      userId = decodedToken.tokenContent.iss;
    }
    console.log(userId);

    const redisOptions = {};
    if (process.env.REDIS_URL) {
      // Allow EB envs to include elasticache urls :)
      redisOptions.url = process.env.REDIS_URL;
    }

    const redisClient = redis.createClient(redisOptions);

    redisClient.subscribe('global');
    redisClient.subscribe(userId);
    // TODO: Subscribe to all organizations that user is part of.

    redisClient.on('message', (channel, actionString) => {
      const action = JSON.parse(actionString);
      if (channel === 'global') {
        if (action.type === 'forceDisconnect') {
          socket.terminate();
        }
      } else {
        console.log('mes', action);
        socket.send(JSON.stringify(action), e => e && socket.terminate());
      }
    });
    // When the socket closes, make sure to close connection to redis
    socket.on('close', err => {
      redisClient.unsubscribe();
      redisClient.quit();
    });
    socket.on('error', err => {
      // Don't crash the server when a connection breaks unexpected
      console.log('Socket client error', err);
    });

    // Add pong event handler - to set
    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });
  socketPongInterval(wss);
};
