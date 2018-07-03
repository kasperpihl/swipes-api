import config from 'config';
import logger from 'src/utils/logger';
const env = config.get('env');

export default (err, req, res, next) => {
  if (env !== 'dev') {
    logger.log('error', err);
  }
  if (err) {
    return res.status(500).send({ ok: false, err });
  }

  // Probably it will never hit this! :D
  return next();
};