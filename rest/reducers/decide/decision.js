"use strict";

import { fromJS } from 'immutable';

const init = (step) => {
  const data = fromJS({
    decision: null
  });

  return step.mergeIn(['data'], data);
}

export {
  init
}
