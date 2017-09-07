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
