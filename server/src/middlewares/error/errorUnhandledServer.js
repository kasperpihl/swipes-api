import config from 'config';
import logger from 'src/utils/logger';
const env = config.get('env');

export default (error, req, res, next) => {
  if (env !== 'dev') {
    logger.log('error', error);
  }

  let message = error;
  if(error.message) {
    message = error.message;
  }
  if(typeof message !== 'string') {
    message = 'Unknown error';
  }
  return res.status(400).send({ ok: false, error: message });
};