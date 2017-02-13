import config from 'config';
import req from 'request';

const jiraConfig = config.get('jira');
const authUrl = (data, callback) => {
  const url = jiraConfig.authUrl;

  callback(null, {
    url,
    type: 'basic',
  });
};
const authCheck = (data, callback) => {
  const {
    url,
    email,
    password,
  } = data;
  const apiUrl = `${url}/rest/api/2/myself`;

  req(apiUrl, {
    auth: {
      user: email,
      pass: password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  }, (err, res) => {
    if (err) {
      return callback(err);
    }

    return callback(null, JSON.parse(res.body));
  });
};
const authData = (data, callback) => {
  const query = data.query;
  const auth_data = {
    access_token: `${query.url}|${query.email}|${query.password}`,
    refresh_token: '',
  };

  return callback(null, {
    auth_data,
    id: `${query.url}|${query.email}`,
    show_name: `${query.email} - ${query.url}`,
  });
};

export {
  authUrl,
  authData,
  authCheck,
};
