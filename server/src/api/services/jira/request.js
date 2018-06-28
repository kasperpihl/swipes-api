import mapApiMethod from './api_map';
import {
  createClient,
} from './utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const request = ({ auth_data, method, params = {} }, callback) => {
  const [url, username, password] = auth_data.access_token.split('|');
  const client = createClient(url, username, password);
  const mappedMethod = mapApiMethod(method, client);

  // T_TODO We have to return null if the method don't exist
  if (!mappedMethod) {
    return Promise.reject(new SwipesError('jira_sdk_not_supported_method'));
  }

  return mappedMethod(params, (err, response) => {
    if (err) {
      return callback(err);
    }

    return callback(null, response);
  });
};

export {
  request,
};
