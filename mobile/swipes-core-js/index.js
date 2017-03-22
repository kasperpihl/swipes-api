import * as actions from './actions';
import * as reducers from './reducers';
import * as utils from './classes/utils';

import Socket from './classes/socket';
import MessageGenerator from './classes/message-generator';

const init = (store, apiUrl) => {
  window.socket = new Socket(store);
  window.msgGen = new MessageGenerator(store);
}

export {
  actions,
  init,
  utils,
  reducers,
}
