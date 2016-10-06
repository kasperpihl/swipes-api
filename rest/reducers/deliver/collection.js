"use strict";

import { fromJS } from 'immutable';

const init = (step) => {
  const data = fromJS({
    deliveries: [
      {collection: []}
    ]
  });

  return step.mergeIn(['data'], data);
}

const add = (step, payload) => {
  const lastIndex = step.getIn(['data', 'deliveries']).size - 1;

  return step.updateIn(['data', 'deliveries', lastIndex, 'collection'], (array) => {
    return array.push(payload.url);
  })
}

export {
  init,
  add
}
