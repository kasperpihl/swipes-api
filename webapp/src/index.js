import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import configureStore from 'src/store/configureStore';
import Analytics from 'classes/analytics';
import IpcListener from 'classes/ipc-listener';

import { init } from 'swipes-core-js';
import * as a from 'actions';
import { version } from '../package.json';
import Root from './react/app/Root';

const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

window.__VERSION__ = version;
window.__DEV__ = (process.env.NODE_ENV !== 'production');
window.__API_URL__ = `${location.origin}`;
window.getURLParameter = name => decodeURIComponent((new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line

const store = configureStore();

const delegate = {
  forceLogout: () => {
    store.dispatch(a.main.forceLogout);
  }
}
window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);
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
