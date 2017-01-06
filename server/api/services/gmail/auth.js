import google from 'googleapis';
import {
  createClient,
  scopes,
} from './utils';

const gmail = google.gmail('v1');
const authUrl = (data, callback) => {
  const oauth2Client = createClient();

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
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

    gmail.users.getProfile({
      userId: 'me',
      auth: oauth2Client,
    }, (err, res) => {
      const auth_data = Object.assign({}, res, tokens);
      const data = {
        auth_data,
        id: res.emailAddress,
        show_name: res.emailAddress,
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
