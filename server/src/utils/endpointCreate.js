import valInput from 'src/middlewares/val/valInput';
import valResponseAndSend from 'src/middlewares/val/valResponseAndSend';
import queueSendJob from 'src/utils/queue/queueSendJob';
import queueCreateJob from 'src/utils/queue/queueCreateJob';

export default (options, middleware) => {
  // FUNCTION MUST BE NAMED endpointCreate. Dont change!
  let addToQueue = false;
  function endpointCreate(routers) {
    if (typeof options !== 'object') {
      options = { endpoint: options };
    }
    if (typeof options.endpoint !== 'string') {
      throw Error('endpointCreate must include options.endpoint');
    }

    if (typeof middleware !== 'function') {
      console.log(middleware);
      throw Error('endpointCreate second parameter must be a middleware');
    }

    const routerTypes = Object.keys(routers);

    if (options.type && routerTypes.indexOf(options.type) === -1) {
      throw Error(`endpointCreate invalid router type: "${options.type}". Expected ${routerTypes.join(', ')}`);
    }
    routers[options.type || 'authed'].all(
      options.endpoint,
      valInput(options.expectedInput),
      middleware,
      async (req, res, next) => {
        if (addToQueue) {
          await queueSendJob(options.endpoint, {
            output: res.locals.output,
            organization_id: res.locals.organization_id,
            user_id: res.locals.user_id,
            input: res.locals.backgroundInput,
          }, res.locals.messageGroupId);
        }
        next();
      },
      valResponseAndSend(options.expectedOutput),
    );
  }

  endpointCreate.background = function (mw) {
    endpointCreate.queueJob = queueCreateJob({ eventName: options.endpoint }, mw);
    addToQueue = true;
    return endpointCreate;
  };
  return endpointCreate;
};
