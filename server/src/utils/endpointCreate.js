import valInput from 'src/middlewares/val/valInput';
import valResponseAndSend from 'src/middlewares/val/valResponseAndSend';

export default (options, middleware) => {
  return (routers) => {
    if(typeof options !== 'object') {
      options = { endpoint: options };
    }
    if(typeof options.endpoint !== 'string') {
      throw Error(`createEndpoint must include options.endpoint`);
    }

    if(typeof middleware !== 'function') {
      throw Error('createEndpoint second parameter must be a middleware');
    }

    const routerTypes = Object.keys(routers);

    if(options.type && routerTypes.indexOf(options.type) === -1) {
      throw Error(`createEndpoint invalid router type: "${options.type}". Expected ${routerTypes.join(', ')}`);
    }
    routers[options.type || 'authed'].all(
      options.endpoint,
      valInput(options.expectedInput),
      middleware,
      valResponseAndSend(options.expectedOutput),
    );
  }
}