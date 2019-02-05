import logger from 'src/utils/logger';
import logGetObject from 'src/utils/log/logGetObject';

export default (options, middleware) => {
  // FUNCTION MUST BE NAMED queueCreateJob. Dont change!
  return function queueCreateJob(router) {
    if (typeof options !== 'object') {
      options = { eventName: options };
    }
    if (typeof options.eventName !== 'string') {
      throw Error(`queueCreateJob must include options.eventName`);
    }

    if (typeof middleware !== 'function') {
      throw Error('queueCreateJob second parameter must be a middleware');
    }

    router.use(async (req, res, next) => {
      if (!req.body.eventName || req.body.eventName !== options.eventName) {
        return next();
      }

      res.locals = {
        ...res.locals,
        ...req.body.payload
      };
      await middleware(req, res, next);
      const logObject = logGetObject(req, res);
      logger.log('info', logObject);

      res.sendStatus(200);
    });
  };
};
