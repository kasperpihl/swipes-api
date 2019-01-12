import url from 'url';
import ws from 'ws';
import tokenCheck from 'src/utils/token/tokenCheck';
import socketPongInterval from 'src/utils/socket/socketPongInterval';
import redisCreateClient from 'src/utils/redis/redisCreateClient';

export default server => {
  const wss = new ws.Server({ server });
  wss.on('connection', async (socket, req) => {
    const parsedUrl = url.parse(req.url, true);
    const { token } = parsedUrl.query;
    const userId = await tokenCheck(token);

    const redisClient = redisCreateClient();

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
        socket.send(JSON.stringify(action), e => e && socket.terminate());
      }
    });
    socket.send(
      JSON.stringify({ type: 'hello' }),
      e => e && socket.terminate()
    );
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
