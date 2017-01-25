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

const localsMap = mapper => (req, res, next) => {
  const error = valjs(mapper, object.of(string).require());
  if (error) {
    return next('Error in localsMap object');
  }
  Object.entries(mapper).forEach(([fromKey, toKey]) => {
    res.locals[toKey] = res.locals[fromKey];
  });
  return next();
};
const sendResponse = (req, res) => {
  const {
    returnObj = {},
  } = res.locals;

  return res.status(200).json({ ok: true, ...returnObj });
};
const valResponseAndSend = schema => (req, res, next) => {
  const error = valjs(res.locals.returnObj, object.as(schema));
  if (error) {
    return next(`Error returnObj: ${error}`);
  }
  return sendResponse(req, res);
};

const setLocals = (name, res, next, state) => {
  const error = valjs(state, object.require());

  if (error) {
    return next(`${name}: Error in setLocals object`);
  }
  // const errors = Object.entries(state).map(([key, value]) => {
    /* if (!constants[key]) {
      res.locals[key] = value;
    }
    else{
      const scheme = constants[key];
      const lError = valjs(value, scheme);
      if (!lError) {
        res.locals[key] = value;
      }
      return lError;
    }*/

  //   return value;
  // }).filter(v => !!v);
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
    return next(`${name} ${error}`);
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
    return next(`body: ${req.route.path} ${error}`);
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
  localsMap,
  valResponseAndSend,
  valLocals,
  valBody,
};
