import { Platform, Linking } from 'react-native';
import Browser from 'react-native-browser';

// ======================================================
// Url
// ======================================================

export const browser = url => () => {
  if (Platform.OS === 'android') {
    Linking.openURL(url);
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
