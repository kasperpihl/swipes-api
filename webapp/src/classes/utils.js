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
export function immuCompare(o1, o2, attr){
  let getMethod = 'get';
  if(Array.isArray(attr)){
    getMethod = 'getIn';
  }
  return (o1[getMethod](attr) === o2[getMethod](attr));
}

export function bindAll(context, methodNames) {
  methodNames.map(function(methodName) {
    if(typeof context[methodName] !== 'function'){
      console.warn('trying to bind non-existing function', methodName);
    }
    else
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

export function autoscroll(element, to, duration){
  if (duration <= 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop == to) return;
    autoscroll(element, to, duration - 10);
  }, 10);
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

export function transitions(enter, leave, appear){
  const returnObj = {};
  if(typeof enter === 'string'){
    returnObj.enter = enter + '-enter';
    returnObj.enterActive = enter + '-enter-active';
    returnObj.leave = enter + '-leave';
    returnObj.leaveActive = enter + '-leave-active';
    returnObj.appear = enter + '-appear';
    returnObj.appearActive = enter + '-appear-active';
  }
  if(typeof leave === 'string'){
    returnObj.leave = leave + '-leave';
    returnObj.leaveActive = leave + '-leave-active';
  }
  if(typeof appear === 'string'){
    returnObj.appear = appear + '-appear';
    returnObj.appearActive = appear + '-appear-active';
  }
  return returnObj;
}

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