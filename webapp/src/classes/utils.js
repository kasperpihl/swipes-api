export function bindAll(context, methodNames) {
  methodNames.map(function(methodName) {
    context[methodName] = context[methodName].bind(context);
  });
}
export function size(obj) {
  if (obj == null) return 0;
  return Object.keys(obj).length;
}

export function randomString(length){
  let text = ''; 
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0 ; i < length ; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function indexBy(arr, iterator){
  const object = {}
  arr.forEach((val, i) => {
    if(typeof iterator === 'string' && typeof val[iterator] === 'string'){
      object[val[iterator]] = val
    }
    else if(typeof iterator === 'function'){
      const res = iterator(val)
      if(typeof res === 'string'){
        object[res] = val;
      }
      else {
        object[i] = val;
      }
    }
    else{
      object[i] = val;
    }
  })
  return object;
}

export function debounce(func, wait, immediate){
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

export function throttle(func, wait){
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