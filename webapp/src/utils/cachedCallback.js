export default function cachedCallback(func) {
  if (typeof func !== 'function') {
    return console.warn('cachedCallback expects a function as argument');
  }
  const cache = {};
  return (cachedVal, ...rest) => {
    if (rest.length) {
      return console.warn('cachedCallback handler only take one argument');
    }
    if (typeof cachedVal !== 'string' && typeof cachedVal !== 'number') {
      return console.warn(
        'cachedCallback handler argument must be string or number'
      );
    }
    if (!cache[cachedVal]) {
      cache[cachedVal] = func.bind(null, cachedVal);
    }
    return cache[cachedVal];
  };
}
