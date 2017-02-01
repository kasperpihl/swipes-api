import config from 'config';
import {
  request,
} from './request';
import {
  createSwipesTempStreamUrl,
} from '../../swipes_url_utils';

const elementsData = (data) => {
  const elements = [];
  const subtitle = '';
  const description = '';
  let title = '';

  title = data.name;

  elements.push({
    type: 'header',
    data: {
      title,
      subtitle,
      description,
    },
  });

  return elements;
};
const buttonsData = (metadata, url) => {
  const buttons = [
    {
      icon: 'Earth',
      title: 'Open in drive.google.com',
      url: `${metadata.webViewLink}/`,
    },
    {
      icon: 'Download',
      title: 'Download',
      url,
    },
  ];

  return buttons;
};
const fileData = (metadata, url) => {
  const file = {
    content_type: metadata.mimeType,
    url,
  };

  return file;
};
const typeData = (metadata) => {
  // these are just the types that we support
  // to see the rest - https://developers.google.com/drive/v3/web/mime-types
  const googleMimeTypes = [
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.drawing',
    'application/vnd.google-apps.presentation',
    'application/vnd.google-apps.spreadsheet',
  ];
  const fileMimeType = metadata.mimeType;

  if (googleMimeTypes.indexOf(fileMimeType) > -1) {
    return 'drive#document';
  }

  return 'drive#binary';
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'file') {
    method = 'files.get';
    params = Object.assign({}, {
      fileId: itemId,
      fields: 'kind, name, webViewLink, id, mimeType',
    });
  } else {
    return callback('This type is not supported :/');
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const metadata = res;

    return createSwipesTempStreamUrl({
      user_id: user.user_id,
      service: {
        id: itemId,
        name: 'drive',
        type: typeData(metadata),
      },
      permission: {
        account_id: auth_data.emailAddress,
      },
    })
    .then((doc) => {
      const id = doc.changes[0].new_val.id;
      const origin = config.get('origin');
      const tempUrl = `${origin}/v1/stream/${id}`;

      const mapElements = elementsData(metadata);
      const mapFile = fileData(metadata, tempUrl);
      const mapButtons = buttonsData(metadata, tempUrl);

      return callback(null, {
        buttons: mapButtons,
        file: Object.assign({}, mapFile, {
          metadata: {
            title: mapElements[0].data.title,
            subtitle: mapElements[0].data.subtitle,
          },
        }),
      });
    })
    .catch((err) => {
      return callback(err);
    });
  });
};

export {
  preview,
};
