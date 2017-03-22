import createLogger from 'redux-logger';

const ignoredActions = ['API_REQUEST', 'API_SUCCESS']; // Ignore actions from Logger
let cacheImmutable = null;
let cacheObject = null;
const transformState = (state) => {
  if (!cacheImmutable) {
    cacheImmutable = state;
    cacheObject = state.toJS();
    return cacheObject;
  }
  state.forEach((section, sectKey) => {
    const cachedSect = cacheImmutable.get(sectKey);
    if (section !== cachedSect) {
      section.forEach((indexValue, indexKey) => {
        const cachedValue = cachedSect.get(indexKey);
        if (indexValue !== cachedValue) {
          if (indexValue && typeof indexValue.toJS === 'function') {
            const sectObj = Object.assign({}, cacheObject[sectKey], { [indexKey]: indexValue.toJS() });
            cacheObject = Object.assign({}, cacheObject, { [sectKey]: sectObj });
          } else {
            const sectObj = Object.assign({}, cacheObject[sectKey], { [indexKey]: indexValue });
            cacheObject = Object.assign({}, cacheObject, { [sectKey]: sectObj });
          }
        }
      });
    }
  });
  cacheImmutable = state;
  return cacheObject;
};
export default {
  middlewares: [
    createLogger(
      {
        stateTransformer: transformState, // state => state.toJS(),
        collapsed: true,
        duration: true,
        // diff: true,
        predicate: (getState, action) => (ignoredActions.indexOf(action.type) === -1),
      },
    ),
  ],
};
