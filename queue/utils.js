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
const notifyMessageGenerator = (from, type, request) => {
  if (request) {
    if (type === 'update') return `${from} asked you for an update`;
    else if (type === 'feedback') return `${from} asked you for feedback`;
    else if (type === 'assets') return `${from} asked you for assets`;
    else if (type === 'decision') return `${from} asked you for a decision`;
  }

  if (type === 'update') return `${from} gave you an update`;
  else if (type === 'feedback') return `${from} gave you feedback`;
  else if (type === 'assets') return `${from} gave you assets`;
  else if (type === 'decision') return `${from} gave you a decision`;

  return `${from} notified you`;
};
const objectToArray = (obj) => {
  return Object.keys(obj).map(key => obj[key]);
};
const getHistoryIndex = (historyArray, group_id) => {
  const index = historyArray.findIndex((item) => {
    return item.group_id === group_id;
  });

  return index;
};
const createNotificationTarget = (mainItem, historyIndex) => {
  return {
    id: mainItem.id,
    history_index: historyIndex,
  };
};

export {
  valLocals,
  setLocals,
  notifyMessageGenerator,
  objectToArray,
  getHistoryIndex,
  createNotificationTarget,
};
