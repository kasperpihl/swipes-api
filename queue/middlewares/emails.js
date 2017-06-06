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
  update: `${s3BucketUrl}email_icons/swipes-email-icon-status.png`,
  assets: `${s3BucketUrl}email_icons/swipes-email-icon-assets.png`,
  decision: `${s3BucketUrl}email_icons/swipes-email-icon-decision.png`,
  default: `${s3BucketUrl}email_icons/swipes-email-icon-notify.png`,
};
const notificationRequestLabels = {
  feedback: 'asks for your feedback',
  update: 'asks you for an update',
  assets: 'asks you for assets',
  decision: 'asks you for a decision',
};
const notificationGiveLabels = {
  feedback: 'gave you feedback',
  update: 'sent you an update',
  assets: 'sent you assets',
  decision: 'sent you a decision',
  default: 'notified you',
};
const notificationReplyLabels = {
  feedback: 'sent you back feedback',
  update: 'sent you back an update',
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

  return `<img style="border: 0px; width: 42px; height: 42px;" src="${icon}">`;
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
    return `${user.profile.first_name} ${notificationLabels[notification_type]} in ${goal.title}`;
  }

  return `${user.profile.first_name} ${notificationLabels[notification_type]} in <strong>${goal.title}</strong>`;
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
      <div class="mcnTextContent" style="height: 24px; padding-left: 90px; padding-top: 10px; padding-bottom: 10px;">
        <table style="float: left">
          <tbody>
            <tr>
              <td>
                <div class="mcnImage" style="display: inline-block;">
                  <img style="display: inline-block; vertical-align: bottom; padding-right: 9px;" src="${attachmentIconUrl}"/>
                </div>
              </td>
              <td>
                <p style="display: inline-block; margin: 0 !important;">${attachment.title}</p>
              </td>
            </tr>
          </tbody>
        </table>
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
  const merge_vars = [];
  const host = config.get('host');

  usersWithFields.forEach((item) => {
    const profile = item.profile;
    const subscriptions = item.settings.subscriptions;

    if (user.id !== item.id && subscriptions.goal_notify) {
      to.push({
        email: item.email,
        name: `${profile.first_name} ${profile.last_name}`,
        type: 'to',
      });
      merge_vars.push({
        rcpt: item.email,
        vars: [{
          name: 'UNSUBSCRIBE_LINK',
          content: `${host}unsubscribe?email=${item.email}&email_type=goal_notify`,
        }],
      });
    }
  });

  const message = {
    to,
    subject,
    merge_vars,
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
const usersInvitationEmail = (req, res, next) => {
  const {
    email,
    invitationToken,
    first_name,
    usersWithFields,
    organization,
  } = res.locals;
  const inviter = usersWithFields[0];
  const inviterFirstName = inviter.profile.first_name;
  const host = config.get('host');
  const template_name = 'welcome-invitation';
  const template_content = [{
    name: '',
    content: '',
  }];
  const merge_vars = [{
    rcpt: email,
    vars: [{
      name: 'NAME',
      content: first_name,
    }, {
      name: 'NAME_INVITER',
      content: inviterFirstName,
    }, {
      name: 'COMPANY_NAME',
      content: organization.name,
    }, {
      name: 'INVITATION_LINK',
      content: `${host}signup?invitation_token=${invitationToken}`,
    }],
  }];
  const to = [
    {
      email,
      name: first_name,
      type: 'to',
    },
  ];
  const subject = `${inviterFirstName} invited you to join the team on Swipes Workspace`;
  const message = {
    to,
    subject,
    merge_vars,
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
    return next(new SwipesError(`usersInvitationEmail - A mandrill error occurred: ${e.name} - ${e.message}`));
  });
};
const usersWelcomeEmail = (req, res, next) => {
  const {
    email,
    first_name,
    organization,
  } = res.locals;
  const template_name = 'welcome-email';
  const template_content = [{
    name: '',
    content: '',
  }];
  const merge_vars = [{
    rcpt: email,
    vars: [{
      name: 'NAME',
      content: first_name,
    }, {
      name: 'COMPANY_NAME',
      content: organization.name,
    }],
  }];
  const to = [
    {
      email,
      name: first_name,
      type: 'to',
    },
  ];
  const subject = 'Welcome to Swipes';
  const message = {
    to,
    subject,
    merge_vars,
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
    return next(new SwipesError(`usersWelcomeEmail - A mandrill error occurred: ${e.name} - ${e.message}`));
  });
};
const meResetPasswordEmail = (req, res, next) => {
  const {
    email,
    first_name,
    token,
  } = res.locals;
  const host = config.get('host');
  const template_name = 'reset-password';
  const template_content = [{
    name: '',
    content: '',
  }];
  const merge_vars = [{
    rcpt: email,
    vars: [{
      name: 'NAME',
      content: first_name,
    }, {
      name: 'RESET_PASSWORD_URL',
      content: `${host}reset.html?token=${token}`,
    }],
  }];
  const to = [
    {
      email,
      name: first_name,
      type: 'to',
    },
  ];
  const subject = 'Reset password for Swipes Workspace';
  const message = {
    to,
    subject,
    merge_vars,
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
    return next(new SwipesError(`meResetPasswordEmail - A mandrill error occurred: ${e.name} - ${e.message}`));
  });
};
const usersAcceptedInvitationEmail = (req, res, next) => {
  const {
    user,
    usersWithFields,
  } = res.locals;
  const template_name = 'invitation-accepted';
  const template_content = [{
    name: '',
    content: '',
  }];
  const merge_vars = [];
  const to = [];

  usersWithFields.forEach((userWithFields) => {
    merge_vars.push({
      rcpt: userWithFields.email,
      vars: [{
        name: 'NAME',
        content: userWithFields.profile.first_name,
      }, {
        name: 'NAME_NEW_MEMBER',
        content: user.profile.first_name,
      }, {
        name: 'COMPANY_NAME',
        content: user.organizations[0].name,
      }],
    });

    to.push({
      email: userWithFields.email,
      name: userWithFields.profile.first_name,
      type: 'to',
    });
  });
  const subject = 'New member joined your team';
  const message = {
    to,
    subject,
    merge_vars,
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
    return next(new SwipesError(`usersAcceptedInvitationEmail - A mandrill error occurred: ${e.name} - ${e.message}`));
  });
};

export {
  goalsNotifySendEmails,
  usersInvitationEmail,
  usersWelcomeEmail,
  meResetPasswordEmail,
  usersAcceptedInvitationEmail,
};
