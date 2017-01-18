import {
  request,
} from './request';

const cardData = (type, service_type, data) => {
  const elements = [];
  let title = '';
  let subtitle = '';

  if (service_type === 'message') {
    data.payload.headers.forEach((header) => {
      const value = header.value;

      if (header.name === 'From') {
        title = value;
      }
      if (header.name === 'Subject') {
        subtitle = value;
      }
    });

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
const preview = ({ auth_data, type, service_type = 'message', itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (service_type === 'message') {
    method = 'users.messages.get';
    params = Object.assign({}, {
      id: itemId,
      userId: 'me',
      format: 'full',
    });
  } else {
    return callback('This type is not supported :/');
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    const elements = cardData(type, service_type, res);

    return callback(null, { elements });
  });
};

export {
  preview,
};
