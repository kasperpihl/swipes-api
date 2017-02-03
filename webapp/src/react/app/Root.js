import React from 'react';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Router from 'src/Router';
import configureStore from 'src/store/configureStore';
// Get classes that needs socket
import Socket from 'classes/socket';
import IpcListener from 'classes/ipc-listener';
import SwipesUrlProvider from 'classes/swipes-url-provider';
import Notifications from 'classes/notifications';
import MessageGenerator from 'classes/message-generator';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  },
});

window.swipesUrlProvider = new SwipesUrlProvider(store);
window.socket = new Socket(store);
window.notifications = new Notifications(store);
window.ipcListener = new IpcListener(store);
window.msgGen = new MessageGenerator(store);

export default function Root() {
  return (
    <Provider store={store}>
      <Router history={history} store={store} />
    </Provider>
  );
}

module.exports = Root;
