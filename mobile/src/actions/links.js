import { Platform } from 'react-native';
import Browser from 'react-native-browser';
import {
  CustomTabs,
  ANIMATIONS_SLIDE,
} from 'react-native-custom-tabs';

// ======================================================
// Url
// ======================================================

export const browser = url => () => {
  console.log('url', url);

  if (Platform.OS === 'android') {
    CustomTabs.openURL(url, {
      toolbarColor: '#ffffff',
      enableUrlBarHiding: true,
      showPageTitle: true,
      enableDefaultShare: true,
      animations: ANIMATIONS_SLIDE,
    });
  } else {
    Browser.open(url, {
      showUrlWhileLoading: true,
      // loadingBarTintColor: processColor('#d64bbd'),
      navigationButtonsHidden: false,
      showActionButton: true,
      showDoneButton: true,
      doneButtonTitle: 'Done',
      showPageTitles: true,
      disableContextualPopupMenu: false,
      hideWebViewBoundaries: false,
      // buttonTintColor: processColor('#d64bbd')
    });
  }
};
