"use strict";

import { fromJS } from 'immutable';

const init = () => {
  return fromJS({deliveries: [{collection: []}]});
}

const attach = (data, payload) => {
  data = fromJS({deliveries: [{collection: []}]});
  const lastIndex = data.get('deliveries').size - 1;
  return data.updateIn(['deliveries', lastIndex, 'collection'], (array) => {
    return array.push(payload.url);
  })
}

export {
  init,
  attach
}
