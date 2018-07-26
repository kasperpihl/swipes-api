import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { version } from '../package.json';
import DeviceInfo from 'react-native-device-info';

import { PersistGate } from 'redux-persist/es/integration/react'
import App from './App';
import configureStore from './store/configureStore';
import { init } from 'swipes-core-js';
import getGlobals from 'utils/globals';
import Analytics from 'utils/analytics';
import codePush from 'react-native-code-push';
import * as a from 'actions';

const { store, persistor } = configureStore({
  globals: getGlobals(),
});
codePush.getUpdateMetadata().then(pkg => pkg && store.dispatch({ 
  type: 'UPDATE_API_HEADERS', 
  payload: { [`sw-${Platform.OS}-code-push-version`]: pkg.label.substr(1) },
}))

window.analytics = new Analytics(store);

init(store);

window.onScroll = (function (store) {
  const animationTime = 300;
  const movement = 50;
  let posY;
  let lockTime;
  let compareY;
  let collapsed = false;
  store.subscribe(() => {
    const state = store.getState();
    if (collapsed && !state.navigation.get('collapsed')) {
      posY = undefined;
      compareY = undefined;
      direction = undefined;
      collapsed = false;
    } else if (!collapsed && state.navigation.get('collapsed')) {
      collapsed = true;
    }
  });
  function onScroll(sE) {
    if (lockTime) {
      const now = new Date().getTime();
      if ((now - lockTime) < animationTime) {
        return;
      }
      lockTime = undefined;
    }
    if (sE.nativeEvent.contentSize.height < sE.nativeEvent.layoutMeasurement.height) {
      return;
    }
    posY = sE.nativeEvent.contentOffset.y;
    const isOverscroll = (posY + sE.nativeEvent.layoutMeasurement.height) >= sE.nativeEvent.contentSize.height;

    // console.log(sE.nativeEvent);
    if (typeof compareY !== 'undefined') {
      if (collapsed) {
        if (isOverscroll || posY >= compareY) {
          compareY = posY;
        } else if ((compareY - posY) > movement || posY < 0) {
          store.dispatch(a.navigation.setCollapsed(false));
          lockTime = new Date().getTime();
          compareY = posY;
        }
      } else if (posY <= compareY) {
        compareY = posY;
      } else if (isOverscroll || ((posY - compareY) > movement && posY > 0)) {
        store.dispatch(a.navigation.setCollapsed(true));
        lockTime = new Date().getTime();
        compareY = posY;
      }
    } else {
      compareY = posY;
    }
  }
  return onScroll;
}(store));

class Root extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;
