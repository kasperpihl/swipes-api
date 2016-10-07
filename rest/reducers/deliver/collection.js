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
  const lastDataIndex = step.getIn(['data']).size - 1;
  const lastDeliveriesIndex = step.getIn(['data', lastDataIndex, 'deliveries']).size - 1;

  return step.updateIn(['data', lastDataIndex, 'deliveries', lastDeliveriesIndex, 'collection'], (array) => {
    return array.push(payload.url);
  })
}

export {
  init,
  add
}
