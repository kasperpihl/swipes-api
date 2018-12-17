import config from 'config';
import logger from 'src/utils/logger';
import randomstring from 'randomstring';
const env = config.get('env');

export default (error, req, res, next) => {
  const localsCopy = Object.assign({}, res.locals);
  delete localsCopy.config;
  if (localsCopy.password) {
    localsCopy.password = '___PROTECTED___';
  }
  if (localsCopy.token) {
    localsCopy.token = '___PROTECTED___';
  }
  const logId = randomstring.generate(50);
  if (env === 'dev') {
    console.log(`--- ERROR ${req.originalUrl} ---`);
    console.log('--- res.locals ---');
    console.error(JSON.stringify(localsCopy, null, 2));
    console.log('--- trace ---');
    console.error(error);
    error.errorInfo && console.log('--- info ---');
    error.errorInfo && console.log(error.errorInfo);
    console.log(`--- ERROR END ---`);
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.log('error', {
    ip,
    request_id: logId,
    user_id: res.locals.user_id,
    headers: req.headers,
    endpoint: req.originalUrl,
    locals: localsCopy,
    stack: error.stack.split('\n'),
    message: error.message,
    info: error.errorInfo,
  });

  const result = { ok: false, error: logId };
  let code = 400;
  if (error.errorCode) {
    code = error.errorCode;
  }

  if (env === 'dev') {
    let message = error;
    if (error.message) {
      message = error.message;
    }
    if (typeof message !== 'string') {
      message = 'Unknown error';
    }
    result.error = message;
    if (error.errorInfo) {
      result.errorInfo = error.errorInfo;
    }
  }

  return res.status(code).send(result);
};
