import { Platform } from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import ImagePicker from 'react-native-image-picker';
import { fromJS } from 'immutable';
import mime from 'react-native-mime-types';
import moment from 'moment';
import * as a from './';
import * as ca from 'swipes-core-js/actions';


// ======================================================
// Upload attacment
// ======================================================
export const upload = (type, successCB, errCB) => (d, getState) => {
  const myId = getState().me.get('id');

  const getSwipesLinkObj = (type, id, title) => ({
    service: {
      name: 'swipes',
      type,
      id,
    },
    permission: {
      account_id: myId,
    },
    meta: {
      title,
    },
  });


  if (type === 'url') {
    d(a.modals.prompt({
      title: 'Add URL',
      placeholder: 'https://',
      keyboardType: 'url',
      onConfirmPress: (e, url) => {
        d(ca.links.create(getSwipesLinkObj(type, url, url))).then((res) => {
          if (res.ok) {
            const att = fromJS({ link: res.link, title: url });
            if (successCB) successCB(att);
          }
        });
      },
      onClose: () => {
        if (errCB()) errCB();
      },
    }));
  } else if (type === 'image') {
    const options = {
      title: 'Attach image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel || response.error || response.customButton) {
        if (errCB) {
          errCB();
        }
        return;
      }

      const type = mime.lookup(response.uri) || 'application/octet-stream';
      const ext = mime.extension(type);
      const name = response.fileName
        || `Photo ${moment().format('MMMM Do YYYY, h:mm:ss a')}.${ext}`;
      const file = {
        name,
        uri: response.uri,
        type,
      };

      d(a.main.loading('Uploading'));

      d(ca.files.create([file])).then((fileRes) => {
        if (fileRes.ok) {
          const link = getSwipesLinkObj('file', fileRes.file.id, fileRes.file.title);

          d(ca.links.create(link)).then((res) => {
            d(a.main.loading());
            if (res.ok) {
              const att = fromJS({ link: res.link, title: fileRes.file.title });
              if (successCB) successCB(att);
            } else {
              if (errCB) errCB(res.err);
              console.warn('faled', res.err);
            }
          });
        } else {
          d(a.main.loading());
        }
      });
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
  const permission = link.get('permission') || link;
  const title = att.get('title') || meta.get('title');
  const activeSliderIndex = getState().navigation.get('sliderIndex');

  window.analytics.sendEvent('Attachment opened', {
    Type: service.get('type'),
    Service: service.get('name'),
  });

  if (service.get('name') === 'swipes') {
    if (service.get('type') === 'note') {
      d(a.navigation.push(activeSliderIndex, {
        id: 'PreviewNote',
        title: service.get('id'),
        props: {
          noteId: service.get('id'),
          noteTitle: title,
        },
      }));
    } else if (service.get('type') === 'url') {
      d(a.links.browser(service.get('id')));
    } else if (service.get('type') === 'file') {
      d(a.main.loading('Loading Preview'));
      d(ca.api.request('links.preview', {
        short_url: permission.get('short_url'),
      })).then((res) => {
        if (Platform.OS === 'ios') {
          OpenFile.openDoc([{
            url: res.preview.file.url,
            fileName: res.preview.header.title,
          }], (error, url) => {
            d(a.main.loading(false));
          });
        } else {
          // Android
          const fileType = res.preview.header.title.split('.').pop();

          OpenFile.openDoc([{
            fileType,
            url: res.preview.file.url,
            fileName: res.preview.header.title,
            cache: false,
          }], (error, url) => {
            d(a.main.loading(false));
          });
        }
      });
    }
  }
};
