import logger from 'src/utils/logger';
import logGetObject from 'src/utils/log/logGetObject';
import endpointDetermineName from 'src/utils//endpoint/endpointDetermineName';

export default (middleware, jobName) => {
  if (typeof jobName !== 'string') {
    jobName = endpointDetermineName();
  }
  // FUNCTION MUST BE NAMED queueCreateJob. Dont change!
  return function queueCreateJob(router) {
    if (typeof middleware !== 'function') {
      throw Error('queueCreateJob second parameter must be a middleware');
    }

    router.use(async (req, res, next) => {
      if (!req.body.job_name || req.body.job_name !== jobName) {
        return next();
      }

      res.locals = {
        ...res.locals,
        job_name: req.body.job_name,
        ...req.body.payload
      };

      await middleware(req, res, next);

      const logObject = logGetObject(req, res);
      logger.log('info', logObject);

      res.sendStatus(200);
    });
  };
};
