import config from 'config';
import logger from 'src/utils/logger';
import logGetObject from 'src/utils/log/logGetObject';

const env = config.get('env');

export default (error, req, res, next) => {
  const logObject = logGetObject(req, res);
  logObject.stack = error.stack && error.stack.split('\n');
  logObject.message = error.message;
  logObject.info = error.errorInfo;

  if (env === 'dev') {
    console.error(JSON.stringify(logObject, null, 2));
  }

  logger('error', logObject);

  const result = {
    ok: false,
    error: 'Something went wrong',
    log_id: logObject.request_id
  };
  let code = 400;

  if (error.errorCode) {
    code = error.errorCode;
  }

  if (error.showToClient) {
    result.error =
      error.showToClient || error.message || 'Something went wrong';

    if (error.errorInfo) {
      result.errorInfo = error.errorInfo;
    }
  } else if (env === 'dev') {
    result.dev_only_error =
      error.showToClient || error.message || 'Something went wrong';

    if (error.errorInfo) {
      result.dev_only_errorInfo = error.errorInfo;
    }
  }

  return res.status(code).send(result);
};
