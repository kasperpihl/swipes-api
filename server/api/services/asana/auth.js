import createClient from './utils';
import {
  unsubscribeFromAllWebhooks,
  subscribeToAllWebhooks,
} from './webhooks';

const authUrl = (data, callback) => {
  const client = createClient();
  const url = client.app.asanaAuthorizeUrl();

  callback(null, {
    url,
    type: 'oauth',
  });
};
const authData = (data, callback) => {
  const {
    query,
    user_id,
  } = data;
  const client = createClient();
  const code = query.code;
  let auth_data;
  let id;
  let show_name;
  let authDataResponse;

  client.app.accessTokenFromCode(code)
    .then((response) => {
      auth_data = response;
      id = auth_data.data.id.toString();
      show_name = auth_data.data.email;
      // Need that for the refresh token
      auth_data.ts_last_token = new Date().getTime() / 1000;

      authDataResponse = { auth_data, id, show_name };

      return unsubscribeFromAllWebhooks({ auth_data, user_id });
    })
    .then(() => {
      return subscribeToAllWebhooks({ auth_data, user_id, accountId: id });
    })
    .then(() => {
      return callback(null, authDataResponse);
    })
    .catch((error) => {
      console.log(error);
      callback(error);
    });
};

export {
  authUrl,
  authData,
};
