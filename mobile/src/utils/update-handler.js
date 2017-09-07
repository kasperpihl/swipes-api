import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';

export default class UpdateHandler {
  constructor(store) {
    this.store = store;
    window.getHeaders = this.getHeaders.bind(this);
    codePush.getUpdateMetadata().then((pkg) => {
      if(pkg) {
        this.codePushVersion = pkg.label;
      }
    })
  }
  openUpdate() {
    const APP_STORE_LINK = 'itms://itunes.apple.com/us/app/apple-store/1250630942?mt=8';
    const PLAY_STORE_LINK = 'market://details?id=com.swipesapp.release';
    if(Platform.OS =='ios'){
      Linking.openURL(APP_STORE_LINK).catch(err => console.error('An error occurred', err));
    }
    else{
      Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('An error occurred', err));
    }
  }
  getHeaders() {
    const headers = {
      'sw-version': window.__VERSION__,
      'sw-platform': window.__PLATFORM__,
      'sw-app-version': DeviceInfo.getVersion(),
      'sw-build-number': DeviceInfo.getBuildNumber(),
    };
    if(this.codePushVersion) {
      headers['sw-code-push-version'] = this.codePushVersion;
    }

    return headers;
  }
}
