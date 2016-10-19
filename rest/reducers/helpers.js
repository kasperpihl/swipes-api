"use strict";

import requireDir from 'require-dir';
import {
  generateSlackLikeId
} from '../util.js';

const reducers = requireDir('./', {recurse: true});

const reducersGet = (step, action) => {
  const directory = reducers[step.type];
  if (!directory) {
    console.log('invalid step type', step.type);
    return null;
  }

  const file = directory[step.subtype];
  if (!file) {
    console.log('invalid step subtype', step.subtype);
    return null;
  }
  const reducer = file[action];
  console.log(file, action, reducer);
  if (typeof reducer !== 'function') {
    console.log('invalid step action', action);
    return null;
  }

  return reducer;
}

export {
  reducersGet
}
