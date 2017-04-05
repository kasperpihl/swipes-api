import config from 'config';
import mandrill from 'mandrill-api/mandrill';
import {
  getHistoryIndex,
} from '../utils';
import {
  SwipesError,
} from '../swipes-error';

const s3BucketUrl = config.get('s3BucketUrl');
const mandrillConfig = config.get('mandrill');
const mandrill_client = new mandrill.Mandrill(mandrillConfig.apiKey);
const notificationIconsMap = {
  feedback: `${s3BucketUrl}email_icons/swipes-email-icon-feedback.png`,
  status: `${s3BucketUrl}email_icons/swipes-email-icon-status.png`,
  assets: `${s3BucketUrl}email_icons/swipes-email-icon-assets.png`,
  decision: `${s3BucketUrl}email_icons/swipes-email-icon-decision.png`,
};
const notificationRequestLabels = {
  feedback: 'asks for your feedback',
  status: 'asks you for status',
  assets: 'asks you for assets',
  decision: 'asks you for a decision',
};
const notificationGiveLabels = {
  feedback: 'gave you feedback',
  status: 'sent you status',
  assets: 'sent you assets',
  decision: 'sent you a decision',
};
const notificationReplyLabels = {
  feedback: 'sent you back feedback',
  status: 'sent you back status',
  assets: 'sent you back assets',
  decision: 'sent you back a decision',
};
const attachmentIcons = {
  note: `${s3BucketUrl}email_icons/swipes-email-icon-attachment-note.png`,
  url: `${s3BucketUrl}email_icons/swipes-email-icon-attachment-link.png`,
  file: `${s3BucketUrl}email_icons/swipes-email-icon-attachment-file.png`,
};
const getNotificationLabelIconContent = (notification_type) => {
  const icon = notificationIconsMap[notification_type];

  return `<img class="notification-icon" src="${icon}">`;
};
const getNotificationLabel = ({ notification_type, request, reply_to, user, goal, subject = false }) => {
  let notificationLabels = notificationGiveLabels;

  if (request) {
    notificationLabels = notificationRequestLabels;
  }
  if (reply_to) {
    notificationLabels = notificationReplyLabels;
  }

  if (subject) {
    return `${user.first_name} ${notificationLabels[notification_type]} in ${goal.title}`;
  }

  return `${user.first_name} ${notificationLabels[notification_type]} in <strong>${goal.title}</strong>`;
};
const getNotificationAttachmentsList = ({ goal, flags = [] }) => {
  const list = [];

  flags.forEach((flag) => {
    const attachment = goal.attachments[flag];

    // T_TODO delete this check some day!
    if (!attachment.link) {
      throw new SwipesError('getNotificationAttachmentsList - old formated data... we should fix that');
    }

    const attachmentIconUrl = attachmentIcons[attachment.link.service.type];

    list.push(`
      <div class="mcnTextContent attachment">
        <div class="mcnImage attachment-icon-wrapper">
            <img class="attachment-icon" src="${attachmentIconUrl}"/>
          </div>
        <p class="attachment-label">${attachment.title}</p>
      </div>
    `);
  });

  return list.join('');
};

const goalsNotifySendEmails = (req, res, next) => {
  const {
    notification_type,
    user,
    goal,
    group_id,
    reply_to,
    usersWithFields,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsNotifySendEmails - history item with ${group_id} is not found`));
  }

  const history = goal.history[historyIndex];
  const request = history.request;
  const subject = getNotificationLabel({
    notification_type,
    request,
    reply_to,
    user,
    goal,
    subject: true,
  });
  const notificationLabel = getNotificationLabel({
    notification_type,
    request,
    reply_to,
    user,
    goal,
  });
  const template_name = 'notify';
  const template_content = [{
    name: 'notification_label_icon',
    content: getNotificationLabelIconContent(notification_type),
  },
  {
    name: 'notification_label',
    content: notificationLabel,
  },
  {
    name: 'notification_message',
    content: `"${history.message}"`,
  },
  {
    name: 'notification_attachments',
    content: getNotificationAttachmentsList({ goal, flags: history.flags }),
  }];
  const to = [];

  usersWithFields.forEach((user) => {
    to.push({
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      type: 'to',
    });
  });

  const message = {
    to,
    subject,
    from_email: 'noreply@swipesapp.com',
    from_name: 'Swipes Team',
    headers: {
      'Reply-To': 'noreply@swipesapp.com',
    },
    important: false,
    merge: true,
    merge_language: 'mailchimp',
  };

  return mandrill_client.messages.sendTemplate({
    template_name,
    template_content,
    message,
  }, (result) => {
    return next();
  }, (e) => {
    return next(new SwipesError(`goalsNotifySendEmails - A mandrill error occurred: ${e.name} - ${e.message}`));
  });
};

export {
  goalsNotifySendEmails,
};
