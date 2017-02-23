import {
  request,
} from './request';

const mainSections = (metadata) => {
  const sections = [];

  if (metadata.notes) {
    sections.push({
      title: 'Description',
      rows: [{
        type: 'standard',
        title: metadata.notes,
      }],
    });
  }

  return sections;
};
const sideSections = (metadata) => {
  const sections = [];

  if (metadata.assignee) {
    const assignee = metadata.assignee;

    sections.push({
      title: 'Assignee',
      rows: [{
        type: 'standard',
        title: `${assignee.name}`,
        leftIcon: {
          src: assignee.photo.image_128x128,
        },
      }],
    });
  }

  return sections;
};
const elementsData = (type, metadata) => {
  const header = {};
  let subtitle = '';

  if (type === 'task') {
    header.title = metadata.name;

    if (metadata.projects.length > 0) {
      subtitle = [];
      metadata.projects.forEach((project) => {
        subtitle.push(project.name);
      });

      header.subtitle = subtitle.join('/');
    }

    return {
      header,
      main: {
        title: 'About',
        sections: mainSections(metadata),
      },
      side: {
        title: 'Details',
        sections: sideSections(metadata),
      },
    };
  }

  return {};
};
const buttonsData = (metadata) => {
  let buttons = [];

  if (metadata.workspace && metadata.workspace.id) {
    buttons = [
      {
        title: 'Open in Asana',
        url: `https://app.asana.com/0/${metadata.workspace.id}/${metadata.id}/`,
      },
    ];
  }

  return buttons;
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

    const metadata = res;
    const elements = elementsData(type, metadata);
    const mapButtons = buttonsData(metadata);

    return callback(null, {
      buttons: mapButtons,
      ...elements,
    });
  });
};

export {
  preview,
};
