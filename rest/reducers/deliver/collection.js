"use strict";

import {
  fromJS,
  Map
} from 'immutable';

const init = (step) => {
  const data = fromJS([
    {
      deliveries: [
        {collection: []}
      ]
    }
  ]);

  return step.merge(new Map({data: data}));
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
