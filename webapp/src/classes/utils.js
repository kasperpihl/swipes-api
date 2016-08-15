

const bindAll = (context, methodNames) => {
  methodNames.map(function(methodName) {
    context[methodName] = context[methodName].bind(context);
  });
}
const size = (obj) => {
  if (obj == null) return 0;
  return Object.keys(obj).length;
}

const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  const later = () => {
    var last = Date.now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }

  const debounced = () => {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

const throttle = (func, wait) => {
  let ctx, args, rtn, timeoutID; // caching
  let last = 0;

  return () => {
    ctx = this;
    args = arguments;
    const delta = new Date() - last;
    if (!timeoutID)
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    return rtn;
  };

  function call () {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }
}

export {
  bindAll,
  size,
  debounce,
  throttle
}