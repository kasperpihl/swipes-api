import { createLogger } from 'redux-logger';

const transformState = state => {
  const parsedState = {};

  Object.keys(state).forEach(key => {
    if (typeof state[key].toJS === 'function') {
      parsedState[key] = state[key].toJS();
    } else {
      parsedState[key] = state[key];
    }
  });
  return parsedState;
};

export default config => {
  config.middlewares.push(
    createLogger({
      stateTransformer: transformState,
      collapsed: true,
      duration: true,
    })
  );
  return config;
};
