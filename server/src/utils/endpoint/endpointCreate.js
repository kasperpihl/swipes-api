import valInput from 'src/middlewares/val/valInput';
import valPermissions from 'src/middlewares/val/valPermissions';
import valResponseAndSend from 'src/middlewares/val/valResponseAndSend';
import queueRunBatch from 'src/utils/queue/queueRunBatch';
import queueCreateJob from 'src/utils/queue/queueCreateJob';
import endpointDetermineName from './endpointDetermineName';

export default (options, middleware) => {
  let endpointName = endpointDetermineName();
  if (!endpointName) {
    throw Error(
      'endpointCreate could not determine endpoint name, make sure it is positioned in the endpoints folder and named endpoint.name.js'
    );
  }

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

    const methods = ['post', 'get', 'delete', 'put'];
    let method = 'all';
    if (options.method) {
      if (methods.indexOf(options.method.toLowerCase()) > -1) {
        method = options.method.toLowerCase();
      } else {
        throw Error('endpointCreate invalid method (post, put, get, delete)');
      }
    }
    routers[options.type || 'authed'][method](
      `/${endpointName}`,
      valInput(options.expectedInput),
      valPermissions(options),
      middleware,
      async (req, res, next) => {
        if (addToQueue) {
          await queueRunBatch({
            job_name: endpointName,
            payload: {
              output: res.locals.output,
              update: res.locals.update || null,
              user_id: res.locals.user_id,
              input: res.locals.backgroundInput
            }
          });
        }
        next();
      },
      valResponseAndSend(options.expectedOutput)
    );
  }

  endpointCreate.background = function(mw) {
    endpointCreate.queueJob = queueCreateJob(mw, endpointName);
    addToQueue = true;
    return endpointCreate;
  };

  return endpointCreate;
};
