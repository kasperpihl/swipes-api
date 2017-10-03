import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import getGlobals from 'src/utils/globals';
import configureStore from 'src/store/configureStore';

import Analytics from 'classes/analytics';
import IpcListener from 'classes/ipc-listener';

import { init } from 'swipes-core-js';
import * as a from 'actions';
import Root from './react/Root';

const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

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
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </Provider>
  , document.getElementById('content'),
);
