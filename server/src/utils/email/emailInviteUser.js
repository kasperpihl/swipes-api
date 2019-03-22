import config from 'config';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';

export default (email, invitationToken, organizatioName, inviterFirstName) => {
  const host = config.get('emailHost');
  const template_name = 'welcome-invitation';
  const template_content = [
    {
      name: '',
      content: ''
    }
  ];
  const merge_vars = [
    {
      rcpt: email,
      vars: [
        {
          name: 'NAME',
          content: 'there'
        },
        {
          name: 'NAME_INVITER',
          content: inviterFirstName
        },
        {
          name: 'COMPANY_NAME',
          content: organizatioName
        },
        {
          name: 'INVITATION_LINK',
          content: `${host}register?invitation_token=${invitationToken}`
        }
      ]
    }
  ];
  const to = [
    {
      email,
      type: 'to'
    }
  ];
  const subject = `${inviterFirstName} invited you to join ${organizatioName} on Swipes Workspace`;
  const message = {
    to,
    subject,
    merge_vars,
    from_email: 'noreply@swipesapp.com',
    from_name: 'Swipes Team',
    headers: {
      'Reply-To': 'noreply@swipesapp.com'
    },
    important: false,
    merge: true,
    merge_language: 'mailchimp'
  };

  return mandrillSendTemplate({
    template_name,
    template_content,
    message
  });
};
