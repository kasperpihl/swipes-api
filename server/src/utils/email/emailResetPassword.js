import config from 'config';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';

export default (email, firstName, token) => {
  const host = config.get('host');
  const template_name = 'reset-password';
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
          content: firstName
        },
        {
          name: 'RESET_PASSWORD_URL',
          content: `${host}reset.html?token=${token}`
        }
      ]
    }
  ];
  const to = [
    {
      email,
      name: firstName,
      type: 'to'
    }
  ];
  const subject = 'Reset password for Swipes Workspace';
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
