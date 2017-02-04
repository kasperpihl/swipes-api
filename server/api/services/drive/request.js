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

    client.setCredentials({
      access_token: auth_data.access_token,
      refresh_token: auth_data.refresh_token,
    });

    if ((now - ts_last_token > now - expires_in) && user) {
      const user_id = user.user_id;

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
                service.merge({
                  auth_data: newAuthData,
                }),
                service,
              );
            }),
          });

        db.rethinkQuery(query)
        .then(() => {
          resolve(newAuthData);
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

      const driveMethod = mapApiMethod(method, client);

      // T_TODO We have to return null if the method don't exist
      if (!driveMethod) {
        return Promise.reject(new SwipesError('drive_sdk_not_supported_method'));
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

      return driveMethod(newParams, (err, response) => {
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
const requestStream = ({ auth_data, urlData, user }, res, next) => {
  const client = createClient();
  const type = urlData.service.type;
  const method = type === 'drive#binary' ? 'files.get' : 'files.export';

  refreshAccessToken(auth_data, user)
    .then((credentials) => {
      client.setCredentials(credentials);

      const driveMethod = mapApiMethod(method);

      // T_TODO We have to return null if the method does not exist
      if (!driveMethod) {
        return Promise.reject(new SwipesError('drive_sdk_not_supported_method'));
      }

      const methodOptions = {
        auth: client,
        fileId: urlData.service.id,
      };

      if (method === 'files.get') {
        methodOptions.alt = 'media';
      } else {
        methodOptions.mimeType = 'application/pdf';
      }

      return driveMethod(methodOptions)
      .on('end', () => {
        res.end();
      })
      .on('error', () => {
        res.end();
      })
      .pipe(res);
    })
    .catch((error) => {
      return next(error);
    });
};

export {
  request,
  requestStream,
};
