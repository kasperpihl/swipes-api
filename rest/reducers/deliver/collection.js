"use strict";

import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const data = fromJS({
    iterations: [
      {
        collection: []
      }
    ]
  });

  return step.merge(new Map({data: data}));
}

const add = (step, payload, userId) => {
  const lastIterationIndex = step.getIn(['data', 'iterations']).size - 1;
  const ts = new Date();

  return step.updateIn(['data', lastIterationIndex, 'collection'], (array) => {
    return array.push({
      ts,
      user_id: userId,
      url: payload.url
    });
  })
}

export {
  init,
  add
}
