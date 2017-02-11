import config from 'config';
import {
  request,
} from './request';
import {
  createSwipesTempStreamUrl,
} from '../../swipes_url_utils';

const env = config.get('env');

const elementsData = (data) => {
  const elements = [];
  const subtitle = '';
  const description = '';
  let title = '';

  title = data.title;

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
const fileData = (metadata, url) => {
  const file = {
    content_type: metadata.mimetype,
    url,
  };

  return file;
};
const buttonsData = (metadata, url) => {
  const buttons = [
    {
      icon: 'Earth',
      title: 'Open in slack',
      url: `${metadata.url_private}/`,
    },
    {
      icon: 'Download',
      title: 'Download',
      url,
    },
  ];

  return buttons;
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'message') {
    return callback(`Type "${type}" is not supported :/`);
    // method = 'channels.history';
    // params = Object.assign({}, {
    //   latest: itemId,
    //   inclusive: true,
    //   count: 1,
    // });
  } else if (type === 'document' || type === 'image' || type === 'file') {
    method = 'files.info';
    params = Object.assign({}, {
      file: itemId,
    });
  } else {
    return callback(`Type "${type}" is not supported :/`);
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const metadata = res.file;

    return createSwipesTempStreamUrl({
      metadata,
      user_id: user.user_id,
      service: {
        id: itemId,
        name: 'slack',
      },
      permission: {
        account_id: auth_data.team_id,
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
