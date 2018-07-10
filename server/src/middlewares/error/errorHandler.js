import config from 'config';
import logger from 'src/utils/logger';
const env = config.get('env');

export default (error, req, res, next) => {
  if (env !== 'dev') {
    logger.log('error', error);
  } else {
    console.log(`--- ERROR ${req.originalUrl} ---`)
    console.error(error);
    error.errorInfo && console.log('--- ERROR INFO ---')
    error.errorInfo && console.log(error.errorInfo);
    console.log(`--- ERROR END ---`)
  }

  let message = error;
  if(error.message) {
    message = error.message;
  }
  if(typeof message !== 'string') {
    message = 'Unknown error';
  }
  const result = { ok: false, error: message };
  if(error.errorInfo) {
    result.errorInfo = error.errorInfo;
  }
  let code = 400;
  if(error.errorCode) {
    code = error.errorCode;
  }
  return res.status(code).send(result);
};