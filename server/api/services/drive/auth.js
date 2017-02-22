import google from 'googleapis';
import {
  createClient,
  scopes,
} from './utils';

const drive = google.drive('v3');
const authUrl = (data, callback) => {
  const oauth2Client = createClient();

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    approval_prompt: 'force', // to get refresh_token everytime
    scope: scopes,
  });

  callback(null, {
    url,
    type: 'oauth',
  });
};
const authData = (data, callback) => {
  if (!data.query) {
    return callback('no_query_object');
  }

  const code = data.query.code;

  if (!code) {
    return callback('no_code');
  }

  const oauth2Client = createClient();

  oauth2Client.getToken(code, (err, tokens) => {
    oauth2Client.setCredentials(tokens);
    console.log(tokens);

    drive.about.get({
      fields: ['user'],
      auth: oauth2Client,
    }, {}, (err, res) => {
      const user = res.user;
      const auth_data = Object.assign({}, user, tokens);

      // Need that for the refresh token
      auth_data.ts_last_token = new Date().getTime();

      const data = {
        auth_data,
        id: user.emailAddress,
        show_name: user.emailAddress,
      };

      return callback(null, data);
    });
  });

  return null;
};

export {
  authUrl,
  authData,
};
