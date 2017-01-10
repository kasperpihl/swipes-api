import r from 'rethinkdb';
import Promise from 'bluebird';
import db from '../../../db';
import mapApiMethod from './api_map';
import {
  createClient,
  buildEmailBody,
} from './utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const refreshAccessToken = (auth_data, user) => {
  return new Promise((resolve, reject) => {
    const now = new Date().getTime();
    const expires_in = auth_data.expiry_date - 30000; // 30 seconds margin of error
    const ts_last_token = auth_data.ts_last_token;
    const client = createClient();

    client.setCredentials(auth_data);

    if ((now - ts_last_token > expires_in) && user) {
      const user_id = user.id;

      client.refreshAccessToken((err, tokens) => {
        const newAuthData = Object.assign({}, tokens, { ts_last_token: now });
        // T_TODO
        // Update service in our database
        // This shouldn't be done here ;)
        // No operations to our database should be allowed from the services
        const query = r.table('users').get(user_id)
          .update({ services: r.row('services')
            .map((service) => {
              return r.branch(
                service('auth_data')('access_token').eq(auth_data.access_token),
                service('auth_data').merge(newAuthData),
                service,
              );
            }),
          });

        db.rethinkQuery(query)
        .then(() => {
          resolve(tokens);
        })
        .catch((error) => {
          reject(error);
        });
      });
    } else {
      resolve(auth_data);
    }
  });
};
const request = ({ auth_data, method, params = {}, user }, callback) => {
  const client = createClient();

  refreshAccessToken(auth_data, user)
    .then((credentials) => {
      client.setCredentials(credentials);

      const gmailMethod = mapApiMethod(method, client);

      // T_TODO We have to return null if the method don't exist
      if (!gmailMethod) {
        return Promise.reject(new SwipesError('gmail_sdk_not_supported_method'));
      }

      // T_TODO think of something better for comparison.
      if (method === 'users.messages.send') {
        if (!params.resource) {
          return Promise.reject(new SwipesError('resource is required!'));
        }

        const encodedMail = buildEmailBody(params.resource);

        if (encodedMail instanceof Error) {
          return Promise.reject(encodedMail);
        }

        params.resource = {
          raw: encodedMail,
        };
      }

      const newParams = Object.assign({}, params, {
        auth: client,
      });

      return gmailMethod(newParams, (err, response) => {
        if (err) {
          return callback(err);
        }

        return callback(null, response);
      });
    })
    .catch((error) => {
      callback(error);
    });
};
const shareRequest = ({ auth_data, type, itemId, user }, callback) => {
  return callback(new SwipesError('shareRequest_not_supported_for_gmail'));
};

export {
  request,
  shareRequest,
};
