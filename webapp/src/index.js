import 'babel-polyfill';
import 'src/utils/globals';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

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

const store = configureStore();

window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);
const delegate = {
  forceLogout: () => {
    store.dispatch(a.main.forceLogout);
  },
  sendEvent: analytics.sendEvent,
}
init(store, delegate);

let Tester;
if (process.env.NODE_ENV !== 'production') {
  Tester = require('./Tester').default; // eslint-disable-line
}

render(
  <Provider store={store}>
    {Tester || (
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    )}
  </Provider>
  , document.getElementById('content'),
);
