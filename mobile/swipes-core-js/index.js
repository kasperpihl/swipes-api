import * as actions from './actions';
import * as reducers from './reducers';
import Socket from './classes/socket';
import * as utils from './classes/utils';

const init = (store, apiUrl) => {
  window.socket = new Socket(store);
}

export {
  actions,
  init,
  utils,
  reducers,
}
