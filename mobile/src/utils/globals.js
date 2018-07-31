import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { fromJS } from 'immutable';
import getIp from 'get-ip';

export default function getGlobals() {
  let apiUrl = 'https://workspace.swipesapp.com';
  if (window.__DEV__ ||
    DeviceInfo.getBundleId() === 'com.swipesapp.iosstaging' ||
    DeviceInfo.getBundleId() === 'com.swipesapp.androidstaging') {
    apiUrl = `http://${getIp()}:5000`;
  }
  const pre = `sw-${Platform.OS}`;

  return fromJS({
    apiUrl,
    isDev: window.__DEV__,
    version: DeviceInfo.getReadableVersion(),
    withoutNotes: true,
    platform: Platform.OS,
    apiHeaders: {
      'sw-platform': Platform.OS,
      [`${pre}-version`]: DeviceInfo.getVersion(),
      [`${pre}-build-number`]: DeviceInfo.getBuildNumber(),
    },
  });
}
