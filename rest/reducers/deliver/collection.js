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

const add = (step, payload, userId) => {
  const lastDataIndex = step.getIn(['data']).size - 1;
  const lastDeliveriesIndex = step.getIn(['data', lastDataIndex, 'deliveries']).size - 1;
  const ts = new Date();

  return step.updateIn(['data', lastDataIndex, 'deliveries', lastDeliveriesIndex, 'collection'], (array) => {
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
