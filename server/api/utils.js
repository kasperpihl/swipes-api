import randomstring from 'randomstring';
import valjs, { shape } from 'valjs';

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

const valWrap = (name, schema, middleware) => (req, res, next) => {
  const error = valjs(res.locals, shape(schema));

  if (error) {
    return next(`${name} ${error}`);
  }

  return middleware(req, res, next);
};

export {
  generateSlackLikeId,
  camelCaseToUnderscore,
  sendResponse,
  valWrap,
};
