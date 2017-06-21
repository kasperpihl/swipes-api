import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { version } from '../package.json';
import DeviceInfo from 'react-native-device-info';

import App from './App';
import configureStore from './store/configureStore';
import { init } from '../swipes-core-js';
import Analytics from './utils/analytics';
import * as a from './actions';

const store = configureStore();

window.__API_URL__ = 'https://staging.swipesapp.com';
window.__PLATFORM__ = Platform.OS;
window.__VERSION__ = version;
window.__WITHOUT_NOTES__ = true;
window.analytics = new Analytics(store);
window.getHeaders = () => ({
  'sw-platform': Platform.OS,
  'sw-version': window.__VERSION__,
  'sw-app-version': DeviceInfo.getVersion(),
});

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
    if (collapsed && !state.getIn(['navigation', 'collapsed'])) {
      posY = undefined;
      compareY = undefined;
      direction = undefined;
      collapsed = false;
    } else if (!collapsed && state.getIn(['navigation', 'collapsed'])) {
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
        <App />
      </Provider>
    );
  }
}

export default Root;
