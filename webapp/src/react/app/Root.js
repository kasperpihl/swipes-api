import React, { PureComponent } from 'react';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Router from 'src/Router';
import configureStore from 'src/store/configureStore';

// Get classes that needs socket
import { init } from 'swipes-core-js';
import * as a from 'actions';
import Analytics from 'classes/analytics';
import IpcListener from 'classes/ipc-listener';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toJS();
  },
});
const delegate = {
  forceLogout: () => {
    store.dispatch(a.main.forceLogout);
  }
}
window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);
init(store, delegate);
window.analytics.sendEvent('App Loaded');

class Root extends PureComponent {
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
