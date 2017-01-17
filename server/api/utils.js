import randomstring from 'randomstring';
import valjs, { shape, string, func, object } from 'valjs';

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
  const error = valjs(res.locals.returnObj, shape(schema));
  if (error) {
    return next(`Error returnObj: ${error}`);
  }
  return sendResponse(req, res);
};

const valLocals = (name, schema, middleware) => (req, res, next) => {
  // let's validate the params #inception! :D
  let error = valjs({ name, schema, middleware }, shape({
    name: string.require(),
    schema: object.require(),
    middleware: func,
  }));

  if (!error) {
    error = valjs(res.locals, shape(schema));
  }

  if (error) {
    return next(`${name} ${error}`);
  }

  if (middleware) {
    return middleware(req, res, next);
  }

  return next();
};

const valBody = (schema, middleware) => (req, res, next) => {
  // let's validate the params #inception! :D
  let error = valjs({ schema, middleware }, shape({
    schema: object.require(),
    middleware: func,
  }));

  if (!error) {
    error = valjs(req.body, shape(schema));
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
  valResponseAndSend,
  valLocals,
  valBody,
};
