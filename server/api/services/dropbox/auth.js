"use strict";

import config from 'config'
import {
  request
} from './request'

const dropboxConfig = config.get('dropbox');

const authUrl = (data, callback) => {
  let url = 'https://www.dropbox.com/oauth2/authorize';
  url += '?response_type=code'
  url += '&client_id=' + dropboxConfig.appId;
  url += '&redirect_uri=' + dropboxConfig.redirectURI;
  // T_TODO state for better security

  callback(null, {
    url,
    type: 'oauth'
  });
}

const authData = (data, callback) => {
  const authData = {};
  const method = 'token';
  const params = {
    code: data.query.code,
    grant_type: 'authorization_code',
    client_id: dropboxConfig.appId,
    client_secret: dropboxConfig.appSecret,
    redirect_uri: dropboxConfig.redirectURI
  }

  request({ authData, method, params }, (err, res) => {
    // console.log('RESULTS', res);
    // return callback('emi_malko_si_eba_maikata');
    if (err) {
      console.log(err);
    }

    const {
      account_id,
      access_token,
      token_type
    } = res;
    const authData = {
      access_token,
      token_type
    };
    const method = 'users.getAccount';
    const params = {
      account_id
    };
    const data = {
      authData,
      id: account_id
    };
    const cursors = {};

    request({ authData, method, params }, (err, res) => {
      if (err) {
        console.log(err);
      }

      data.show_name = res.email;

      const method = 'files.listFolder.getLatestCursor';
      const params = {
        path: '',
        recursive: true
      }

      request({authData, method, params}, (err, res) => {
        if (err) {
          console.log(err);
        }

        cursors['list_folder_cursor'] = res.cursor;
        data.cursors = cursors;

        return callback(null, data);
      });
    })
  })
}

export {
  authUrl,
  authData
}
