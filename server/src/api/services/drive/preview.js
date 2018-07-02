import config from 'config';
import {
  request,
} from './request';
import {
  googleMimeTypesToExtMap,
} from './utils';
import {
  createSwipesTempStreamUrl,
} from '../../swipes_url_utils';

const env = config.get('env');

const elementsData = (data) => {
  const title = data.name;

  return {
    header: {
      title,
    },
  };
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
  const fileMimeType = metadata.mimeType;

  if (googleMimeTypesToExtMap[fileMimeType]) {
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
      metadata,
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
      const originWithPort = env === 'dev' ? `${origin}:5000` : origin;
      const tempUrl = `${originWithPort}/v1/stream/?id=${id}`;

      const mapElements = elementsData(metadata);
      const mapFile = fileData(metadata, tempUrl);
      const mapButtons = buttonsData(metadata, tempUrl);

      return callback(null, {
        buttons: mapButtons,
        file: mapFile,
        ...mapElements,
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