import url from 'url';
import ws from 'ws';
import usersProfilePic from './users';
import userServices from './services';
import notes from './notes';
import commonEvents from './common-events';
import commonEventsMultiple from './common-events-multiple';
import {
  parseToken,
} from '../api/utils';

const auth = (token) => {
  if (token) {
    const parsedToken = parseToken(token);

    if (!parsedToken) {
      return false;
    }

    return parsedToken.content.iss;
  }

  console.log('No token passed!');
  return false;
};

const websocketStart = (server) => {
  const WebSocketServer = ws.Server;
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (socket) => {
    // you might use location.query.token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    const url_parsed = url.parse(socket.upgradeReq.url, true);
    const token = url_parsed.query.token;

    const user_id = auth(token);

    // If the token is not valid we terminate the socket
    if (!user_id) {
      console.log('terminating socket - no_auth');
      socket.terminate();

      return;
    }

    socket.on('message', (msg) => {
      const message = JSON.parse(msg);
      const date = new Date().toISOString();

      if (message.type === 'ping') {
        socket.send(JSON.stringify({
          type: 'pong',
          payload: {
            id: message.id,
            ts: date,
          },
        }));
      }
    });

    socket.send(JSON.stringify({ type: 'hello', payload: 'world' }));

    usersProfilePic(socket, user_id);
    userServices(socket, user_id);
    notes(socket, user_id);
    commonEvents(socket, user_id);
    commonEventsMultiple(socket, user_id);
  });

  console.log('ws server is online');
};

export { websocketStart as default };
