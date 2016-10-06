"use strict";

import requireDir from 'require-dir';
import {
  generateSlackLikeId
} from '../util.js';

const reducers = requireDir('./', {recurse: true});

const reducersGet = (step, action = 'init') => {
  const directory = reducers[step.type];
  if (!directory) {
    console.log('invalid step type', step);
    return null;
  }

  const file = directory[step.subtype];
  if (!file) {
    console.log('invalid step subtype', step);
    return null;
  }

  const reducer = file[action];
  if (typeof reducer !== 'function') {
    console.log('invalid step action', step);
    return null;
  }

  return reducer;
}

export {
  reducersGet
}
