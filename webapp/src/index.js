import 'src/utils/polyfills';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createLocation } from 'history';

import getGlobals from 'src/utils/globals';
import configureStore from 'src/store/configureStore';

import Analytics from 'classes/analytics';
import IpcListener from 'classes/ipc-listener';

import { init } from 'swipes-core-js';
import * as a from 'actions';
import Root from './react/Root';

import 'swiss';

const store = configureStore({
  globals: getGlobals()
});

window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);

const delegate = {
  forceLogout: () => {
    store.dispatch(a.main.forceLogout);
  },
  sendEvent: analytics.sendEvent,
}
init(store, delegate);

render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={false}>
      <Root />
    </BrowserRouter>
  </Provider>
  , document.getElementById('content'),
);
