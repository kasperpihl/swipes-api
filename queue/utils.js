import config from 'config';
import valjs, { string, func, object } from 'valjs';

const setLocals = (name, res, next, state) => {
  const error = valjs(state, object.require());

  if (error) {
    return next(`middleware setLocals ${name}: ${error}`);
  }

  const debug = config.get('valjs_debug');
  Object.entries(state).forEach(([key, value]) => {
    if (res.locals[key] && debug) {
      console.warn(`Warning: ${key} is reassinged in ${name}`);
    }

    res.locals[key] = value;
  });

  return null;
};
const valLocals = (name, schema, middleware) => (req, res, next) => {
  // let's validate the params #inception! :D
  let error = valjs({ name, schema, middleware }, object.as({
    name: string.require(),
    schema: object.require(),
    middleware: func,
  }));

  if (!error) {
    error = valjs(res.locals, object.as(schema));
  }

  if (error) {
    return next(`middleware input ${name}: ${error}`);
  }

  if (middleware) {
    return middleware(req, res, next, setLocals.bind(null, name, res, next));
  }

  return next();
};

export {
  valLocals,
};
