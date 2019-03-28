import 'src/utils/polyfills';

import React from 'react';
import { render } from 'react-dom';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { SwissProvider } from 'swiss-react';
import { OptimistProvider } from 'react-optimist';
import { PersistGate } from 'redux-persist/es/integration/react';

import { BrowserRouter } from 'react-router-dom';
import getGlobals from 'src/utils/globals';
import configureStore from 'src/redux/configureStore';

import Analytics from 'src/classes/analytics';
import IpcListener from 'src/classes/ipc-listener';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import Socket from 'core/classes/Socket';
import CoreProvider from 'core/react/_hocs/CoreProvider';

import { StripeProvider } from 'react-stripe-elements';

// Init core!
if (urlGetParameter('go_to')) {
  localStorage.setItem('go_to', urlGetParameter('go_to'));
}
if (urlGetParameter('invitation_token')) {
  localStorage.setItem('invitation_token', urlGetParameter('invitation_token'));
}
const { store, persistor } = configureStore({
  global: getGlobals(),
  invitation: fromJS({
    invitationToken: localStorage.getItem('invitation_token') || null,
    invitedToTeam: null
  })
});

window.socket = new Socket(store);
// END Init core

import Root from './react/Root';

import './swiss';

if (process.env.NODE_ENV !== 'production') {
  window.openTester = () => {
    store.dispatch({
      type: 'DEV_OPEN_TESTER'
    });
  };
}

window.ipcListener = new IpcListener(store);
window.analytics = new Analytics(store);

let token = 'pk_live_vLIRvcBoJ4AA9sFUpmVT11gQ';

if (
  process.env.NODE_ENV !== 'production' ||
  window.location.hostname === 'staging.swipesapp.com'
) {
  token = 'pk_test_0pUn7s5EyQy7GeAg93QrsJl9';
}

render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SwissProvider>
        <BrowserRouter>
          <OptimistProvider>
            <StripeProvider apiKey={token}>
              <CoreProvider>
                <Root />
              </CoreProvider>
            </StripeProvider>
          </OptimistProvider>
        </BrowserRouter>
      </SwissProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('content')
);
