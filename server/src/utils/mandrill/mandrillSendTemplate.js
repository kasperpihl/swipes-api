import config from 'config';
import mandrill from 'mandrill-api/mandrill';
const mandrillClient = new mandrill.Mandrill(config.get('mandrillKey'));

export default function mandrillSendTemplate(
  templateName,
  { email, mergeVars, subject }
) {
  const merge_vars = [
    {
      rcpt: email,
      vars: Object.entries(mergeVars).map(([name, content]) => ({
        name,
        content
      }))
    }
  ];

  const message = {
    to: [
      {
        email,
        type: 'to'
      }
    ],
    subject,
    merge_vars,
    from_email: 'help@swipesapp.com',
    from_name: 'Swipes Team',
    important: false,
    merge: true,
    merge_language: 'mailchimp'
  };

  const options = {
    message,
    template_name: templateName,
    template_content: [
      {
        name: '',
        content: ''
      }
    ]
  };

  return new Promise((resolve, reject) => {
    mandrillClient.messages.sendTemplate(options, resolve, reject);
  });
}
