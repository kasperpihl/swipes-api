"use strict";

import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const data = fromJS({
    iterations: [
      {
        decision: null
      }
    ]
  });

  return step.merge(new Map({data: data}));
}

const decide = (step, payload, userId) => {
  const lastIterationIndex = step.getIn(['data', 'iterations']).size - 1;
  const decision = payload.decision === true ? true : false;
  const ts = new Date();

  return step.updateIn(['data', 'iterations', lastIterationIndex], () => {
    return {
      decision,
      ts,
      user_id: userId
    };
  });
}

export {
  init,
  decide
}
