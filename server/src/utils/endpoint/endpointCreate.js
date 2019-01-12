import valInput from 'src/middlewares/val/valInput';
import valPermissions from 'src/middlewares/val/valPermissions';
import valResponseAndSend from 'src/middlewares/val/valResponseAndSend';
import queueSendJob from 'src/utils/queue/queueSendJob';
import queueCreateJob from 'src/utils/queue/queueCreateJob';
import endpointDetermineName from './endpointDetermineName';

export default (options, middleware) => {
  let endpointName = endpointDetermineName();
  if (!endpointName) {
    throw Error(
      'endpointCreate could not determine endpoint name, make sure it is positioned in the endpoints folder and named endpoint.name.js'
    );
  }

  endpointName = `/${endpointName}`;

  if (typeof options === 'function') {
    middleware = options;
  }
  if (typeof options !== 'object') {
    options = {};
  }
  if (typeof middleware !== 'function') {
    throw Error('endpointCreate second parameter must be a middleware');
  }

  let addToQueue = false;
  // FUNCTION MUST BE NAMED endpointCreate. Dont change!
  function endpointCreate(routers) {
    const routerTypes = Object.keys(routers);

    if (options.type && routerTypes.indexOf(options.type) === -1) {
      throw Error(
        `endpointCreate invalid router type: "${
          options.type
        }". Expected ${routerTypes.join(', ')}`
      );
    }
    routers[options.type || 'authed'].all(
      endpointName,
      valInput(options.expectedInput),
      valPermissions(options),
      middleware,
      async (req, res, next) => {
        if (addToQueue) {
          await queueSendJob(
            endpointName,
            {
              output: res.locals.output,
              organization_id: res.locals.organization_id,
              user_id: res.locals.user_id,
              input: res.locals.backgroundInput
            },
            res.locals.messageGroupId
          );
        }
        next();
      },
      valResponseAndSend(options.expectedOutput)
    );
  }

  endpointCreate.background = function(mw) {
    endpointCreate.queueJob = queueCreateJob({ eventName: endpointName }, mw);
    addToQueue = true;
    return endpointCreate;
  };

  return endpointCreate;
};
