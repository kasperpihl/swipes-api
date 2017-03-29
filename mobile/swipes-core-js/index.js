import * as actions from './actions';
import * as reducers from './reducers';

import Socket from './classes/socket';
import FilterHandler from './classes/filter-handler';
import MessageGenerator from './message-generator';

const init = (store, apiUrl) => {
  window.socket = new Socket(store);
  window.msgGen = new MessageGenerator(store);
  window.filterHandler = new FilterHandler(store);
}

export {
  actions,
  init,
  reducers,
}
