import mime from 'mime-types';
import Promise from 'bluebird';
import {
  request,
} from './request';

const elementsData = (type, data) => {
  const elements = [];

  if (type === 'file') {
    let subtitle = data.path_display || '';

    if (subtitle.length > 0) {
      subtitle = subtitle.split('/').slice(0, -1).join('/');
    }

    const title = data.name || '';

    elements.push({
      type: 'header',
      data: {
        title,
        subtitle,
      },
    });
  }

  return elements;
};
const fileData = (type, res) => {
  const name = res.metadata.name;
  const nameArr = name.split('.');
  const ext = nameArr[nameArr.length - 1];
  const content_type = mime.lookup(ext) || null;
  const url = res.link;
  let file = {};

  if (type === 'file') {
    file = {
      content_type,
      url,
    };
  }

  return file;
};
const buttonsData = (type, metadata, res) => {
  const url = res.link;
  let buttons = {};

  if (type === 'file') {
    buttons = [
      {
        icon: 'Desktop',
        title: 'Open on Desktop',
        command: {
          name: 'dropbox_open_desktop',
          params: {
            path: metadata.path_display,
          },
        },
      },
      {
        icon: 'Earth',
        title: 'Open in Dropbox.com',
        url: `https://www.dropbox.com/home${metadata.path_lower}/`,
      },
      {
        icon: 'Download',
        title: 'Download',
        url,
      },
    ];
  }

  return buttons;
};
const metadata = ({ auth_data, type, itemId, user }) => {
  return new Promise((resolve, reject) => {
    let method = '';
    let params = {};

    if (type === 'file') {
      method = 'files.getMetadata';
      params = Object.assign({}, {
        path: itemId,
      });
    } else {
      return reject('This type is not supported :/');
    }

    return request({ auth_data, method, params, user }, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
};
const file = ({ auth_data, type, itemId, user }) => {
  return new Promise((resolve, reject) => {
    let method = '';
    let params = {};

    if (type === 'file') {
      method = 'files.getTemporaryLink';
      params = Object.assign({}, {
        path: itemId,
      });
    } else {
      return reject('This type is not supported :/');
    }

    return request({ auth_data, method, params, user }, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  Promise.all([
    metadata({ auth_data, type, itemId, user }),
    file({ auth_data, type, itemId, user }),
  ])
  .then((results) => {
    const metadata = results[0];
    const file = results[1];
    const mapElements = elementsData(type, metadata);
    const mapFile = fileData(type, file);
    const mapButtons = buttonsData(type, metadata, file);

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
};

export {
  preview,
};
