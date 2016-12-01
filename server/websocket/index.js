import url from 'url';
import config from 'config';
import ws from 'ws';
import jwt from 'jwt-simple';
import usersProfilePic from './services';
import userServices from './users';
import commonEvents from './common-events';
import commonEventsMultiple from './common-events-multiple';

const auth = (token) => {
  if (token) {
    const jwt_token_secret = config.get('jwtTokenSecret');

    try {
      const decoded = jwt.decode(token, jwt_token_secret);

      return decoded.iss;
    } catch (err) {
      console.log(err);
      console.log('Can\'t parse the token!');

      return false;
    }
  } else {
    console.log('No token passed!');

    return false;
  }
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

    socket.send(JSON.stringify({ type: 'hello', payload: 'world' }));

    usersProfilePic(socket, user_id);
    userServices(socket, user_id);
    commonEvents(socket, user_id);
    commonEventsMultiple(socket, user_id);
  });

  console.log('ws server is online');
};

export { websocketStart as default };
