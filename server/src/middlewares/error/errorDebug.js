import config from 'config';
const env = config.get('env');

export default (err, req, res, next) => {
  if (env === 'dev') {
    console.log(`--- DEBUG ERROR ${req.route.path} ---`)
    console.error(err);
    console.log(`--- DEBUG END ---`)
  }

  return next(err);
};