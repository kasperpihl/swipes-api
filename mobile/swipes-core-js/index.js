import * as actions from './actions';
import * as reducers from './reducers';
import * as constants from './constants';

import Socket from './classes/socket';
import FilterHandler from './classes/filter-handler';
import AutoComplete from './classes/auto-complete';
import MessageGenerator from './message-generator';

const init = (store, delegate) => {
  window.delegate = delegate;
  window.socket = new Socket(store, delegate);
  window.msgGen = new MessageGenerator(store);
  window.autoComplete = new AutoComplete(store);
  window.filterHandler = new FilterHandler(store);
};

export {
  actions,
  init,
  reducers,
  constants,
};
