import {
  request,
} from './request';

const cardData = (type, service_type, data) => {
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
const preview = ({ auth_data, type, service_type = 'file', itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (service_type === 'file') {
    method = 'files.getMetadata';
    params = Object.assign({}, {
      path: itemId,
    });
  } else {
    return callback('This type is not supported :/');
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const elements = cardData(type, service_type, res);

    return callback(null, { elements });
  });
};

export {
  preview,
};
