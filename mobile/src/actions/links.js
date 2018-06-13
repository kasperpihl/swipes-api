import Browser from 'react-native-browser';

// ======================================================
// Url
// ======================================================

export const browser = url => () => {
  console.log('url', url);

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
};
