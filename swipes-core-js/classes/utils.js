import { fromJS } from 'immutable';
import { funcWrap } from 'valjs';

export function isShareURL(url) {
  url = url || '';
  const shareURLPrefix = `${window.location.origin}/s/`;
  if (url.startsWith(shareURLPrefix)) {
    return true;
  }
  return false;
}

export function valAction(actionName, arrayArgs, actionHandler) {
  function handler(valErr) {
    if (!valErr) {
      return actionHandler(...Array.prototype.slice.call(arguments, 1));
    }
    console.warn(`Redux action [${actionName}]: ${valErr}`);
    return () => Promise.resolve();
  }
  return funcWrap(arrayArgs, handler);
}

export function iconForService(service) {
  switch (service) {
    case 'slack':
      return 'SlackLogo';
    case 'dropbox':
      return 'DropboxLogo';
    case 'jira':
      return 'JiraLogo';
    case 'drive':
      return 'DriveLogo';
    case 'asana':
      return 'AsanaLogo';
    default:
      return 'SwipesLogo';
  }
}

export function attachmentIconForService(service) {
  switch (service.get('type')) {
    case 'url':
      return 'Hyperlink';
    case 'note':
      return 'Note';
    default:
      return 'File';
  }
}

export function traverseElement(target, iterator) {
  do {
    if (target && !iterator(target)) {
      target = target.parentNode;
    } else {
      target = undefined;
    }
  } while (target);
  return target;
}
export function getParentByClass(target, className) {
  let node;
  do {
    if (target.classList.contains(className)) {
      node = target;
    }
    target = target.parentNode;
  } while (!node && target && typeof target.getAttribute === 'function');
  return node;
}
export function nearestAttribute(target, attribute) {
  let value;
  do {
    value = target.getAttribute(attribute);
    target = target.parentNode;
  } while (!value && typeof target.getAttribute === 'function');
  return value;
}

export function setupDelegate(delegate) {
  const orgArgs = Array.prototype.slice.call(arguments, 1);

  return function callDelegate(name) {
    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...orgArgs.concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  };
}

export function queryStringToObject(query) {
  const object = {};
  const segments = query.split('&');

  segments.forEach((seg) => {
    const pair = seg.split('=');

    pair[0] = decodeURIComponent(pair[0]);
    pair[1] = decodeURIComponent(pair[1]);

    if (typeof object[pair[0]] === 'undefined') {
      object[pair[0]] = pair[1];
    } else if (typeof object[pair[0]] === 'string') {
      const arr = [object[pair[0]], pair[1]];
      object[pair[0]] = arr;
    } else {
      object[pair[0]].push(pair[1]);
    }
  });
  return object;
}


export function setupCachedCallback(method, ctx) {
  const cachedMethod = {};
  return function cachedCallback(id) {
    if (!cachedMethod[id]) {
      const args = Array.from(arguments);
      cachedMethod[id] = method.bind(ctx, ...args);
    }
    return cachedMethod[id];
  };
}

export function requireParams() {
  // if (typeof obj !== 'object') {
  //   return console.warn('requireParams should be {varName}');
  // }
  //
  // // let counter = 0;
  // const keys = Object.keys(obj);
  //
  // keys.forEach((key) => {
  //   if (typeof obj[key] === 'undefined') {
  //     // console.warn(`Required params [${counter}]: ${key} not set in ${caller}`);
  //   }
  //   // counter += 1;
  // });
}

export function shortUrlFromShareUrl(url) {
  return url.split('/s/')[1].split('/')[0];
}
export function immuCompare(o1, o2, attr) {
  let getMethod = 'get';
  if (Array.isArray(attr)) {
    getMethod = 'getIn';
  }
  return (o1[getMethod](attr) === o2[getMethod](attr));
}

export function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100), 10);
  G = parseInt(((G * (100 + percent)) / 100), 10);
  B = parseInt(((B * (100 + percent)) / 100), 10);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16));

  return `#${RR}${GG}${BB}`;
}

export function hexToRgb(hex) {
  if (hex.startsWith('#')) {
    hex = hex.substring(1);
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255; // eslint-disable-line
  const g = (bigint >> 8) & 255; // eslint-disable-line
  const b = bigint & 255; // eslint-disable-line

  return `${r},${g},${b}`;
}

export function isImage(file) {
  if (!file) {
    return false;
  }

  return (file.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

export function bindAll(context, methodNames) {
  methodNames.forEach((methodName) => {
    if (typeof context[methodName] !== 'function') {
      console.warn('trying to bind non-existing function', methodName);
    } else {
      context[methodName] = context[methodName].bind(context);
    }
  });
}
export function size(obj) {
  if (obj == null) return 0;
  return Object.keys(obj).length;
}

export function randomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function autoscroll(element, to, duration) {
  if (duration <= 0) return;
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  setTimeout(() => {
    element.scrollTop += perTick;
    if (element.scrollTop === to) return;
    autoscroll(element, to, duration - 10);
  }, 10);
}

export function indexBy(arr, iterator) {
  const object = {};
  arr.forEach((val, i) => {
    if (typeof iterator === 'string' && typeof val[iterator] === 'string') {
      object[val[iterator]] = val;
    } else if (typeof iterator === 'function') {
      const res = iterator(val);
      if (typeof res === 'string') {
        object[res] = val;
      } else {
        object[i] = val;
      }
    } else {
      object[i] = val;
    }
  });
  return object;
}

export function decodeHtml(text) {
  const replacements = [
    ['amp', '&'],
    ['apos', '\''],
    ['lt', '<'],
    ['gt', '>'],
  ];

  replacements.forEach((replace) => {
    text = text.replace(new RegExp(`&${replace[0]};`, 'g'), replace[1]);
  });

  return text;
}

export function transitions(enter, leave, appear) {
  const returnObj = {};
  if (typeof enter === 'string') {
    returnObj.enter = `${enter}-enter`;
    returnObj.enterActive = `${enter}-enter-active`;
    returnObj.leave = `${enter}-leave`;
    returnObj.leaveActive = `${enter}-leave-active`;
    returnObj.appear = `${enter}-appear`;
    returnObj.appearActive = `${enter}-appear-active`;
  }
  if (typeof leave === 'string') {
    returnObj.leave = `${leave}-leave`;
    returnObj.leaveActive = `${leave}-leave-active`;
  }
  if (typeof appear === 'string') {
    returnObj.appear = `${appear}-appear`;
    returnObj.appearActive = `${appear}-appear-active`;
  }
  return returnObj;
}


export function debounce(func, wait, immediate) {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;
  let hasCalledSecondTime;
  if (wait == null) wait = 100;

  function later() {
    const last = Date.now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate || hasCalledSecondTime) {
        result = func.apply(context, args);
        context = args = null;
        hasCalledSecondTime = undefined;
      }
    }
  }

  function debounced() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    const isSecondTime = immediate && timeout && !hasCalledSecondTime;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    if (isSecondTime) {
      hasCalledSecondTime = true;
    }

    return result;
  }

  debounced.isRunning = () => !!timeout;

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

export function throttle(func, wait) {
  let ctx;
  let args;
  let rtn;
  let timeoutID; // caching
  let last = 0;

  function call() {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }

  function throttled() {
    ctx = this;
    args = arguments;
    const delta = new Date() - last;
    if (!timeoutID) {
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    }

    return rtn;
  }
  throttled.isRunning = () => !!timeoutID;
  throttled.clear = () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = 0;
      last = 0;
    }
  };
  return throttled;
}


export function setupLoading(ctx) {
  let _loadingStates = fromJS({});
  let unmounted = false;
  const defaultObj = {};
  const timers = {};
  if (!ctx.state) {
    ctx.state = {};
  }
  ctx.state._loadingStates = _loadingStates;
  const currComponentWillUnmount = ctx.componentWillUnmount;
  ctx.componentWillUnmount = () => {
    unmounted = true;
    if (typeof currComponentWillUnmount === 'function') {
      currComponentWillUnmount.bind(ctx)();
    }
  };
  let setClearTimer;
  function getAllLoading() {
    return _loadingStates;
  }
  function setLoading(name, label, duration) {
    const newState = { loading: true };
    if (label) {
      newState.loadingLabel = label;
    }
    _loadingStates = _loadingStates.set(name, newState);
    this.setState({ _loadingStates });
    setClearTimer(name, duration);
  }
  function clearLoading(name, label, duration) {
    if (unmounted) {
      return;
    }
    const newState = { loading: false };
    if (label && label.startsWith('!')) {
      newState.errorLabel = label.substr(1);
    } else if (label) {
      newState.successLabel = label;
    }
    _loadingStates = _loadingStates.set(name, newState);
    this.setState({ _loadingStates });
    setClearTimer(name, duration);
  }
  setClearTimer = (name, duration) => {
    clearTimeout(timers[name]);
    if (typeof duration === 'number') {
      timers[name] = setTimeout(() => {
        if (!unmounted) {
          clearLoading(name);
        }
      }, duration);
    }
  };
  function getLoading(name) {
    return _loadingStates.get(name) || defaultObj;
  }


  ctx.setLoading = setLoading.bind(ctx);
  ctx.getLoading = getLoading.bind(ctx);
  ctx.clearLoading = clearLoading.bind(ctx);
  ctx.getAllLoading = getAllLoading.bind(ctx);

  bindAll(ctx, ['setLoading', 'getLoading', 'clearLoading']);
}
