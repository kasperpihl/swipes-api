import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as a from 'actions';

import Router from 'src/Router';
import configureStore from 'src/store/configureStore';

// Get classes that needs socket
import Socket from 'classes/socket';
import Analytics from 'classes/analytics';
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
window.analytics = new Analytics(store);
window.analytics.sendEvent('App Loaded');

class Root extends Component {
  componentDidMount() {
    if (window.ipcListener.platform) {
      document.getElementById('content').classList.add(`platform-${window.ipcListener.platform}`);
    }
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history} store={store} />
      </Provider>
    );
  }
}

export default Root;

module.exports = Root;
