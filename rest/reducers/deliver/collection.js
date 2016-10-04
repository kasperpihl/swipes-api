"use strict";

import { toJS, fromJS } from 'immutable';

const init = () => {
  return fromJS({deliveries: [{collection: []}]});
}

const add = (data, payload) => {
  const step = fromJS(data);
  const lastIndex = step.getIn(['data', 'deliveries']).size - 1;

  return step.updateIn(['data', 'deliveries', lastIndex, 'collection'], (array) => {
    return array.push(payload.url);
  })
}

export {
  init,
  add
}
