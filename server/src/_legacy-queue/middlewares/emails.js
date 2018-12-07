import config from 'config';
import mandrill from 'mandrill-api/mandrill';
import SwipesError from 'src/utils/SwipesError';

const mandrill_client = new mandrill.Mandrill(config.get('mandrillKey'));
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
  const template_content = [
    {
      name: '',
      content: '',
    },
  ];
  const merge_vars = [
    {
      rcpt: email,
      vars: [
        {
          name: 'NAME',
          content: first_name,
        },
        {
          name: 'NAME_INVITER',
          content: inviterFirstName,
        },
        {
          name: 'COMPANY_NAME',
          content: organization.name,
        },
        {
          name: 'INVITATION_LINK',
          content: `${host}register?invitation_token=${invitationToken}`,
        },
      ],
    },
  ];
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

  return mandrill_client.messages.sendTemplate(
    {
      template_name,
      template_content,
      message,
    },
    result => {
      return next();
    },
    e => {
      return next(
        new SwipesError(
          `usersInvitationEmail - A mandrill error occurred: ${e.name} - ${
            e.message
          }`
        )
      );
    }
  );
};
const usersWelcomeEmail = (req, res, next) => {
  const { email, first_name, confirmation_token } = res.locals;
  const host = config.get('host');
  const template_name = 'new-welcome-email';
  const template_content = [
    {
      name: '',
      content: '',
    },
  ];
  const merge_vars = [
    {
      rcpt: email,
      vars: [
        {
          name: 'NAME',
          content: first_name,
        },
        {
          name: 'CONFIRMATION_LINK',
          content: `${host}confirm?confirmation_token=${confirmation_token}`,
        },
      ],
    },
  ];
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

  return mandrill_client.messages.sendTemplate(
    {
      template_name,
      template_content,
      message,
    },
    result => {
      return next();
    },
    e => {
      return next(
        new SwipesError(
          `usersWelcomeEmail - A mandrill error occurred: ${e.name} - ${
            e.message
          }`
        )
      );
    }
  );
};
const meResetPasswordEmail = (req, res, next) => {
  const { email, first_name, token } = res.locals;
  const host = config.get('host');
  const template_name = 'reset-password';
  const template_content = [
    {
      name: '',
      content: '',
    },
  ];
  const merge_vars = [
    {
      rcpt: email,
      vars: [
        {
          name: 'NAME',
          content: first_name,
        },
        {
          name: 'RESET_PASSWORD_URL',
          content: `${host}reset.html?token=${token}`,
        },
      ],
    },
  ];
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

  return mandrill_client.messages.sendTemplate(
    {
      template_name,
      template_content,
      message,
    },
    result => {
      return next();
    },
    e => {
      return next(
        new SwipesError(
          `meResetPasswordEmail - A mandrill error occurred: ${e.name} - ${
            e.message
          }`
        )
      );
    }
  );
};
const usersAcceptedInvitationEmail = (req, res, next) => {
  const { user, usersWithFields } = res.locals;
  const template_name = 'invitation-accepted';
  const template_content = [
    {
      name: '',
      content: '',
    },
  ];
  const merge_vars = [];
  const to = [];

  usersWithFields.forEach(userWithFields => {
    merge_vars.push({
      rcpt: userWithFields.email,
      vars: [
        {
          name: 'NAME',
          content: userWithFields.profile.first_name,
        },
        {
          name: 'NAME_NEW_MEMBER',
          content: user.profile.first_name,
        },
        {
          name: 'COMPANY_NAME',
          content: user.organizations[0].name,
        },
      ],
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

  return mandrill_client.messages.sendTemplate(
    {
      template_name,
      template_content,
      message,
    },
    result => {
      return next();
    },
    e => {
      return next(
        new SwipesError(
          `usersAcceptedInvitationEmail - A mandrill error occurred: ${
            e.name
          } - ${e.message}`
        )
      );
    }
  );
};

export {
  usersInvitationEmail,
  usersWelcomeEmail,
  meResetPasswordEmail,
  usersAcceptedInvitationEmail,
};
