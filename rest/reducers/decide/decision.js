"use strict";

import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const data = fromJS([
    {
      decision: null
    }
  ]);

  return step.merge(new Map({data: data}));
}

const decide = (step, payload) => {
  const lastDataIndex = step.getIn(['data']).size - 1;
  const decision = payload.decision === true ? true : false;

  return step.updateIn(['data', lastDataIndex, 'decision'], () => {
    return decision;
  });
}

export {
  init,
  decide
}
