import config from 'config';
import google from 'googleapis';
// import {
//   request,
// } from './request';

const OAuth2 = google.auth.OAuth2;
const gmailConfig = config.get('gmail');
const authUrl = (data, callback) => {
  const oauth2Client = new OAuth2(
    gmailConfig.clientId,
    gmailConfig.clientSecret,
    gmailConfig.redirectUri,
  );
  const scopes = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
  ];

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
  // if (!data.query) {
  //   return callback('no_query_object');
  // }
  //
  // const code = data.query.code;
  //
  // if (!code) {
  //   return callback('no_code');
  // }
  //
  // const auth_data = {};
  // const method = 'oauth.access';
  // const params = {
  //   code,
  //   client_id: gmailConfig.clientId,
  //   client_secret: gmailConfig.clientSecret,
  //   redirect_uri: gmailConfig.redirectUri,
  // };

  console.log('authDATA');
  // return request({ auth_data, method, params }, (err, res) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //
  //   const auth_data = Object.assign({}, res);
  //
  //   delete auth_data.ok;
  //
  //   const data = {
  //     auth_data,
  //     id: res.team_id,
  //     show_name: res.team_name,
  //   };
  //
  //   return callback(null, data);
  // });
};

export {
  authUrl,
  authData,
};
