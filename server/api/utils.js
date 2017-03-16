import config from 'config';
import randomstring from 'randomstring';
import valjs, { string, func, object, array, any } from 'valjs';
import jwt from 'jwt-simple';

const generateSlackLikeId = (type = '', number = 8) => {
  const id = randomstring.generate(number).toUpperCase();

  return type.toUpperCase() + id;
};
const camelCaseToUnderscore = (word) => {
  // http://stackoverflow.com/questions/30521224/javascript-convert-camel-case-to-underscore-case
  return word.replace(/([A-Z]+)/g, (x, y) => { return `_${y.toLowerCase()}`; }).replace(/^_/, '');
};
const getClientIp = (req) => {
  const ip = req.headers['x-forwarded-for'] ?
              req.headers['x-forwarded-for'].split(',')[0] :
              req.connection.remoteAddress;

  return ip;
};

const getSwipesLinkObj = (type, id, title, account_id) => {
  return {
    service: {
      id,
      name: 'swipes',
      type,
    },
    permission: {
      account_id,
    },
    meta: {
      title,
    },
  };
};

const createTokens = (user_id) => {
  const token = jwt.encode({
    iss: user_id,
    r: generateSlackLikeId('', 3),
  }, config.get('jwtTokenSecret'));
  const shortToken = token.split('.').splice(1, 2).join('.');
  const prefix = 'sw.';

  return {
    token: `${prefix}${token}`,
    shortToken: `${prefix}${shortToken}`,
  };
};
const parseToken = (token) => {
  const jwtHead = config.get('jwtTokenHead');
  // removing the sw. in the beggining of the token
  const tokenWithoutSw = token.split('.').splice(1, 2).join('.');
  const constructedToken = `${jwtHead}.${tokenWithoutSw}`;
  const dbToken = `sw.${constructedToken}`;

  try {
    const content = jwt.decode(constructedToken, config.get('jwtTokenSecret'));

    return {
      constructedToken,
      dbToken,
      content,
    };
  } catch (err) {
    return null;
  }
};
const sendResponse = (req, res) => {
  const {
    reload_available,
    update_available,
    update_url,
    returnObj = {},
  } = res.locals;

  if (reload_available) {
    returnObj.reload_available = reload_available;
  }
  if (update_available) {
    returnObj.update_available = update_available;
    returnObj.update_url = update_url;
  }

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

const mapLocals = (getLocals, handler) => (req, res, next) => {
  // let's validate the params #inception! :D
  const error = valjs({ getLocals, handler }, object.as({
    getLocals: any.of(string.require(), array.of(string).require()).require(),
    handler: func.require(),
  }));

  if (error) {
    return next(`middleware input mapLocals: ${error}`);
  }

  let locals = getLocals;

  if (!Array.isArray(getLocals)) {
    locals = [getLocals];
  }
  locals = locals.map((l) => {
    return res.locals[l];
  });
  handler(setLocals.bind(null, 'mapLocals', res, next), ...locals);
  return next();
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

  const params = Object.assign({}, req.params, req.query, req.body);

  if (!error) {
    error = valjs(params, object.as(schema));
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
  mapLocals,
  valBody,
  getClientIp,
  getSwipesLinkObj,
  createTokens,
  parseToken,
};
