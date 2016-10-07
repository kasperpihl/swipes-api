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

const decide = (step, payload, userId) => {
  const lastDataIndex = step.getIn(['data']).size - 1;
  const decision = payload.decision === true ? true : false;
  const ts = new Date();

  return step.updateIn(['data', lastDataIndex], () => {
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
