import config from 'config';
import {
  request,
} from './request';

const slackConfig = config.get('slack');
const authUrl = (data, callback) => {
  let url = 'https://slack.com/oauth/authorize';
  url += `?client_id=${slackConfig.clientId}`;
  url += '&scope=client';
  url += `&redirect_uri=${slackConfig.redirectUri}`;

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

  const auth_data = {};
  const method = 'oauth.access';
  const params = {
    code,
    client_id: slackConfig.clientId,
    client_secret: slackConfig.clientSecret,
    redirect_uri: slackConfig.redirectUri,
  };

  return request({ auth_data, method, params }, (err, res) => {
    if (err) {
      console.log(err);
    }

    const auth_data = Object.assign({}, res);

    delete auth_data.ok;

    const data = {
      auth_data,
      id: res.team_id,
      show_name: res.team_name,
    };

    return callback(null, data);
  });
};

export {
  authUrl,
  authData,
};
