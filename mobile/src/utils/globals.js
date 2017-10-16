import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default function getGlobals() {
  let apiUrl = 'https://workspace.swipesapp.com';
  if( window.__DEV__ || 
    DeviceInfo.getBundleId() === 'com.swipesapp.iosstaging' || 
    DeviceInfo.getBundleId() === 'com.swipesapp.androidstaging') {
      apiUrl = 'https://staging.swipesapp.com';
  }
  const pre = `sw-${Platform.OS}`;
  return {
    apiUrl,
    isDev: window.__DEV__,
    version: DeviceInfo.getReadableVersion(),
    withoutNotes: true,
    platform: Platform.OS,
    apiHeaders: {
      'sw-platform': Platform.OS,
      [`${pre}-version`]: DeviceInfo.getVersion(),
      [`${pre}-build-number`]: DeviceInfo.getBuildNumber(),
    }
  };
}