"use strict";

import req from 'request';
import { request } from './request';
import { createClient } from './utils';
import {
  unsubscribeFromAllWebhooks,
  subscribeToAllWebhooks
} from './webhooks';

const authUrl = (data, callback) => {
  const client = createClient();
  const url = client.app.asanaAuthorizeUrl();

  callback(null, {
    type: 'oauth',
    url: url
  });
}

const authData = (data, callback) => {
  const client = createClient();
  const code = data.query.code;
  const userId = data.userId;
  let authData, id, show_name;

  client.app.accessTokenFromCode(code)
    .then((response) => {
      authData = response;
      id = response.data.id;
      show_name = response.data.email;
      // Need that for the refresh token
      response.ts_last_token = new Date().getTime() / 1000;

      data = { authData, id, show_name };

      return unsubscribeFromAllWebhooks({ authData, userId });
    })
    .then(() => {
      subscribeToAllWebhooks({ authData, userId, accountId: id });

      callback(null, data);
    })
    .catch((error) => {
      console.log(error);
      callback(error);
    })
}

export {
  authUrl,
  authData
}
