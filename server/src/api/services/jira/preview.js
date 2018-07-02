import moment from 'moment';
import j2m from 'j2m';
import {
  request,
} from './request';

const mainSections = (metadata) => {
  const sections = [];

  if (metadata.fields.description) {
    sections.push({
      title: 'Description',
      rows: [{
        type: 'markdown',
        content: j2m.toM(metadata.fields.description),
      }],
    });
  }

  if (metadata.fields.comment.total > 0) {
    const total = metadata.fields.comment.total;
    const comment = metadata.fields.comment.comments[total - 1];
    const author = comment.author;
    const date = moment(comment.created).format('D MMM YYYY');

    sections.push({
      title: 'Last comment',
      rows: [{
        type: 'standard',
        title: `${author.displayName} commented on ${date}`,
        secondary: true,
        leftIcon: {
          src: author.avatarUrls['48x48'],
        },
      }, {
        type: 'markdown',
        indentLeft: true,
        content: j2m.toM(comment.body),
      }],
    });
  }

  return sections;
};
const sideSections = (metadata) => {
  const sections = [];

  if (metadata.fields.assignee) {
    const assignee = metadata.fields.assignee;

    sections.push({
      title: 'Assignee',
      rows: [{
        type: 'standard',
        title: `${assignee.displayName}`,
        leftIcon: {
          src: assignee.avatarUrls['48x48'],
        },
      }],
    });
  }

  if (metadata.fields.issuetype) {
    const type = metadata.fields.issuetype;

    sections.push({
      title: 'Type',
      rows: [{
        type: 'standard',
        title: `${type.name}`,
        leftIcon: {
          color: '#4FE69B',
        },
      }],
    });
  }

  if (metadata.fields.duedate) {
    const date = moment(metadata.fields.duedate).format('D MMM YYYY');

    sections.push({
      title: 'Due',
      rows: [{
        type: 'standard',
        title: `${date}`,
      }],
    });
  }

  if (metadata.fields.labels && metadata.fields.labels.length > 0) {
    sections.push({
      title: 'Labels',
      rows: [{
        type: 'tags',
        tags: metadata.fields.labels,
      }],
    });
  }

  if (metadata.fields.attachment && metadata.fields.attachment.length > 0) {
    const attachments = metadata.fields.attachment;

    sections.push({
      title: 'Attachments',
      rows: attachments.map((attachment) => {
        const map = {
          type: 'attachment',
          title: attachment.filename,
          src: attachment.content,
        };

        if (attachment.thumbnail) {
          map.leftIcon = attachment.thumbnail;
        }

        return map;
      }),
    });
  }

  return sections;
};
const elementsData = (metadata) => {
  const title = metadata.fields.summary;
  const subtitle = `Project - ${metadata.fields.project.name}`;

  return {
    header: {
      title,
      subtitle,
    },
    main: {
      title: 'About',
      sections: mainSections(metadata),
    },
    side: {
      title: 'Details',
      sections: sideSections(metadata),
    },
  };
};
const buttonsData = (metadata) => {
  const buttons = [
    {
      icon: 'Earth',
      title: 'Open in Jira',
      url: `${metadata.self}/`,
    },
  ];

  return buttons;
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'task') {
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
      console.log(err);
      return callback(err);
    }

    const metadata = res;
    const mapElements = elementsData(metadata);
    const mapButtons = buttonsData(metadata);

    return callback(null, {
      buttons: mapButtons,
      ...mapElements,
    });
  });
};

export {
  preview,
};