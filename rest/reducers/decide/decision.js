"use strict";

import { fromJS } from 'immutable';

const init = (step) => {
  const data = fromJS({
    decision: null
  });

  return step.mergeIn(['data'], data);
}

const decide = (step, payload) => {
  const decision = payload.decision === true ? true : false;

  return step.updateIn(['data', 'decision'], () => {
    return decision;
  });
}

export {
  init,
  decide
}
