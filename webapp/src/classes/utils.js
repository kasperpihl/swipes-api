export function isShareURL(url){
  url = url || "";
  const shareURLPrefix = window.location.origin + '/s/';
  if(url.startsWith(shareURLPrefix)){
    return true;
  }
  return false;
}
export function shortUrlFromShareUrl(url){
  return url.split('/s/')[1].split('/')[0];
}

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

export function decodeHtml(text) {
  var replacements = [
    ['amp', '&'],
    ['apos', '\''],
    ['lt', '<'],
    ['gt', '>']
  ];

  replacements.forEach(function(replace){
    text = text.replace(new RegExp('&'+replace[0]+';', 'g'), replace[1]);
  });

  return text;
};

export function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later(){
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

  var debounced = function(){
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

  debounced.clear = function(){
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

export function throttle(func, wait){
  var ctx, args, rtn, timeoutID; // caching
  var last = 0;

  return function throttled(){
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