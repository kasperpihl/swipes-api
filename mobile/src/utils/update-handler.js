import { Platform, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';

export default class UpdateHandler {
  constructor(store) {
    this.store = store;
    window.getHeaders = this.getHeaders.bind(this);
    codePush.getUpdateMetadata().then((pkg) => {
      if(pkg) {
        this.codePushVersion = pkg.label.substr(1);
      }
    })
  }
  getHeaders() {
    const pre = `sw-${Platform.OS}`;
    const headers = {
      'sw-platform': window.__PLATFORM__,
      [`${pre}-version`]: DeviceInfo.getVersion(),
      [`${pre}-build-number`]: DeviceInfo.getBuildNumber(),
    };
    if(this.codePushVersion) {
      headers[`${pre}-code-push-version`] = this.codePushVersion;
    }

    return headers;
  }
}
