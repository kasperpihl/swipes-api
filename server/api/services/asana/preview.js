import {
  request,
} from './request';

const cardData = (type, data) => {
  const header = {};
  let subtitle = '';

  if (type === 'task') {
    header.title = data.name;

    if (data.projects.length > 0) {
      subtitle = [];
      data.projects.forEach((project) => {
        subtitle.push(project.name);
      });

      header.subtitle = subtitle.join('/');
    }

    return {
      header,
    };
  }

  return {};
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'task') {
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

    // console.log(res);
    const elements = cardData(type, res);

    return callback(null, { ...elements });
  });
};

export {
  preview,
};
