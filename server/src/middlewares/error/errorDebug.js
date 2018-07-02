export default (err, req, res, next) => {
  if (err && env === 'dev') {
    console.error(err);
  }

  return next(err);
};