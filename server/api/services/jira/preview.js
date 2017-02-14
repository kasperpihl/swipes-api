import {
  request,
} from './request';

const elementsData = (metadata) => {
  const elements = [];
  const title = metadata.fields.summary;
  const subtitle = `Project - ${metadata.fields.project.name}`;
  const description = metadata.fields.description;

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
const buttonsData = (metadata) => {
  const buttons = [
    {
      icon: 'Earth',
      title: 'Open in jira',
      url: `${metadata.self}/`,
    },
  ];

  return buttons;
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'issue') {
    method = 'issue.getIssue';
    params = Object.assign({}, {
      issueId: itemId,
      // For the future Tihomir to figure out why description is null when I put it in the fields
      // fields: [
      //   'summary',
      //   'project',
      //   'description',
      // ],
    });
  } else {
    return callback(`${type} type is not supported :/`);
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const metadata = res;
    const mapElements = elementsData(metadata);
    const mapButtons = buttonsData(metadata);

    return callback(null, {
      buttons: mapButtons,
      elements: mapElements,
    });
  });
};

export {
  preview,
};
