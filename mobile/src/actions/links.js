import { Platform } from 'react-native';
import Browser from 'react-native-browser';
import {
  CustomTabs,
  ANIMATIONS_SLIDE,
} from 'react-native-custom-tabs';
import OpenFile from 'react-native-doc-viewer';
import * as a from './';

// ======================================================
// Url
// ======================================================

export const browser = url => () => {
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

// ======================================================
// Preview attacment
// ======================================================
export const preview = att => (d, getState) => {
  // K_TODO: Backward compatibility remove || link after database query
  const link = att.get('link') || att;
  const service = link.get('service') || link;
  const meta = link.get('meta') || link;
  const title = att.get('title') || meta.get('title');
  const activeSliderIndex = getState().getIn(['navigation', 'sliderIndex']);


  if (service.get('name') === 'swipes' && service.get('type') === 'note') {
    d(a.navigation.push(activeSliderIndex, {
      id: 'PreviewNote',
      title: service.get('id'),
      props: {
        noteId: service.get('id'),
        noteTitle: title,
      },
    }));
  } else if (service.get('name') === 'swipes' && service.get('type') === 'url') {
    d(browser(service.get('id')));
  } else {
    console.log(att.toJS());

    // OpenFile.openDoc([{
    //   url: "http://www.snee.com/xml/xslt/sample.doc",
    //   fileName: "sample"
    // }], (error, url) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     console.log(url)
    //   }
    // })
  }
};
