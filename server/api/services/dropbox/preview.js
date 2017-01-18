import mime from 'mime-types';
import Promise from 'bluebird';
import {
  request,
} from './request';

const elementsData = (type, service_type, data) => {
  const elements = [];

  if (service_type === 'file') {
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
const fileData = (type, service_type, res) => {
  const name = res.metadata.name;
  const nameArr = name.split('.');
  const ext = nameArr[nameArr.length - 1];
  const content_type = mime.lookup(ext) || null;
  const url = res.link;
  let file = {};

  if (service_type === 'file') {
    file = {
      content_type,
      url,
    };
  }

  return file;
};
const elements = ({ auth_data, type, service_type = 'file', itemId, user }) => {
  return new Promise((resolve, reject) => {
    let method = '';
    let params = {};

    if (service_type === 'file') {
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

      const elements = elementsData(type, service_type, res);

      return resolve(elements);
    });
  });
};
const file = ({ auth_data, type, service_type = 'file', itemId, user }) => {
  return new Promise((resolve, reject) => {
    let method = '';
    let params = {};

    if (service_type === 'file') {
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

      const file = fileData(type, service_type, res);

      return resolve(file);
    });
  });
};
const preview = ({ auth_data, type, service_type = 'file', itemId, user }, callback) => {
  Promise.all([
    elements({ auth_data, type, service_type, itemId, user }),
    file({ auth_data, type, service_type, itemId, user }),
  ])
  .then((results) => {
    return callback(null, {
      elements: results[0],
      file: results[1],
    });
  })
  .catch((err) => {
    return callback(err);
  });
};

export {
  preview,
};
