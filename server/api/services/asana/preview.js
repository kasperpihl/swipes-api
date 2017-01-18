import {
  request,
} from './request';

const cardData = (type, service_type, data) => {
  const elements = [];
  let subtitle = '';

  // let photo = null;

  if (service_type === 'story') {
    if (data.projects.length > 0) {
      subtitle = [];
      data.projects.forEach((project) => {
        subtitle.push(project.name);
      });

      subtitle = subtitle.join('/');
    }

    const title = data.name || '';
    const description = data.notes || '';

    // if (data.assignee && data.assignee.photo) {
    //   photo = data.assignee.photo;
    // }

    elements.push({
      type: 'header',
      data: {
        title,
        subtitle,
        description,
      },
    });
  }

  return elements;
};
const preview = ({ auth_data, type, service_type = 'story', itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (service_type === 'story') {
    method = 'tasks.findById';
    params = Object.assign({}, {
      id: itemId,
      opt_expand: 'assignee',
    });
  } else {
    return callback('This type is not supported :/');
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    console.log(res);

    const elements = cardData(type, service_type, res);

    return callback(null, { elements });
  });
};

export {
  preview,
};
