import valInput from 'src/middlewares/val/valInput';
// import valResponseAndSend from 'src/middlewares/val/valResponseAndSend';

export default (options, middleware) => {
  return (router) => {
    if(typeof options !== 'object') {
      options = { eventName: options };
    }
    if(typeof options.eventName !== 'string') {
      throw Error(`queueCreateJob must include options.eventName`);
    }

    if(typeof middleware !== 'function') {
      throw Error('queueCreateJob second parameter must be a middleware');
    }

    router.use(
      async (req, res, next) => {
        if(!req.body.eventName || req.body.eventName !== options.eventName) {
          return next();
        }
        return middleware(req, res, next);
      },
    );
  }
}