import logger from 'src/utils/logger';

export default (req, res, next) => {
  if(req.body) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const allowed = ['token', 'password', 'text', 'title'];
    const filteredBody = Object.keys(req.body)
      .filter(key => !allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: req.body[key],
        };
      }, {});

    logger.log('info', {
      ip,
      user_id: res.locals.user_id,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: filteredBody,
      route: req.originalUrl,
    });
  }

  return next();
}