import url from 'url';
import ws from 'ws';
import tokenCheck from 'src/utils/token/tokenCheck';
import socketPongInterval from 'src/utils/socket/socketPongInterval';
import redisCreateClient from 'src/utils/redis/redisCreateClient';
import { query } from 'src/utils/db/db';

export default server => {
  const wss = new ws.Server({ server });
  wss.on('connection', async (socket, req) => {
    const parsedUrl = url.parse(req.url, true);
    const { token } = parsedUrl.query;
    const userId = await tokenCheck(token);

    const teamRes = await query(
      `
        SELECT team_id
        FROM team_users
        WHERE user_id = $1
      `,
      [userId]
    );
    const redisClient = redisCreateClient();

    redisClient.subscribe('global');
    redisClient.subscribe(userId);
    teamRes.rows.forEach(team => {
      redisClient.subscribe(team.team_id);
    });

    redisClient.on('message', (channel, actionString) => {
      try {
        const action = JSON.parse(actionString);

        if (action.type === 'forceDisconnect') {
          socket.terminate();
        } else if (action.type === 'subscribeChannel') {
          redisClient.subscribe(action.payload.channel);
        } else if (action.type === 'unsubscribeChannel') {
          redisClient.unsubscribe(action.payload.channel);
        } else if (action.type === 'update') {
          socket.send(JSON.stringify(action), e => e && socket.terminate());
        } else {
          console.log('unknown redis message', action.type);
        }
      } catch (e) {
        console.log('redis invalid payload', actionString);
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
    socket.on('message', message => {
      if (message === 'ping') {
        socket.send('pong');
      }
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
