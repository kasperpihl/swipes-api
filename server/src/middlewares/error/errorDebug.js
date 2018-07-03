import config from 'config';
const env = config.get('env');

export default (err, req, res, next) => {
  if (err && env === 'dev') {
    console.error('errorDebug', err);
  }

  return next(err);
};