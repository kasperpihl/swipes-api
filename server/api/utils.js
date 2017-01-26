import config from 'config';
import randomstring from 'randomstring';
import valjs, { string, func, object } from 'valjs';

const generateSlackLikeId = (type) => {
  const id = randomstring.generate(8).toUpperCase();

  return type.toUpperCase() + id;
};
const camelCaseToUnderscore = (word) => {
  // http://stackoverflow.com/questions/30521224/javascript-convert-camel-case-to-underscore-case
  return word.replace(/([A-Z]+)/g, (x, y) => { return `_${y.toLowerCase()}`; }).replace(/^_/, '');
};
const sendResponse = (req, res) => {
  const {
    returnObj = {},
  } = res.locals;

  return res.status(200).json({ ok: true, ...returnObj });
};
const valResponseAndSend = schema => (req, res, next) => {
  if (schema) {
    const error = valjs(res.locals, object.as(schema));

    if (error) {
      return next(`output ${req.route.path}: ${error}`);
    }

    Object.entries(schema).forEach(([key, value]) => {
      res.locals.returnObj[key] = res.locals[key];
    });
  }

  return sendResponse(req, res);
};

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

const valBody = (schema, middleware) => (req, res, next) => {
  // let's validate the params #inception! :D
  let error = valjs({ schema, middleware }, object.as({
    schema: object.require(),
    middleware: func,
  }), true);

  if (!error) {
    error = valjs(req.body, object.as(schema));
  }

  if (error) {
    return next(`body ${req.route.path}: ${error}`);
  }

  if (middleware) {
    return middleware(req, res, next);
  }

  return next();
};

export {
  generateSlackLikeId,
  camelCaseToUnderscore,
  sendResponse,
  valResponseAndSend,
  valLocals,
  valBody,
};
