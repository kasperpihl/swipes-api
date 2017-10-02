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
import Root from './react/Root';

const regeneratorRuntime = require('babel-runtime/regenerator'); // eslint-disable-line
if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

window.__VERSION__ = version;
window.__DEV__ = (process.env.NODE_ENV !== 'production');
window.__API_URL__ = `${location.origin}`;
window.getURLParameter = name => decodeURIComponent((new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line

// Detect which browser and what version.
window.sayswho = (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})().split(' ');
window.__BROWSER__ = sayswho[0];
window.__BROWSER_VERSION__ = sayswho[1];



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
