import config from 'config';
import mandrill from 'mandrill-api/mandrill';
import {
  SwipesError,
} from '../swipes-error';

const mandrillConfig = config.get('mandrill');
const mandrill_client = new mandrill.Mandrill(mandrillConfig.apiKey);
const goalsNotifySendEmails = (req, res, next) => {
  const {
    usersWithFields,
  } = res.locals;
  const template_name = 'test-template';
  const template_content = [{
    name: '',
    content: '',
  }];
  const to = [];
  const mergeVars = [];

  usersWithFields.forEach((user) => {
    to.push({
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      type: 'to',
    });
    mergeVars.push({
      rcpt: user.email,
      vars: [{
        name: 'first_name',
        content: user.first_name,
      },
      {
        name: 'last_name',
        content: user.last_name,
      }],
    });
  });

  const message = {
    to,
    subject: 'testing stuff',
    from_email: 'tihomir@swipesapp.com',
    from_name: 'Tihomir Valkanov',
    headers: {
      'Reply-To': 'tihomir@swipesapp.com',
    },
    important: false,
    merge: true,
    merge_language: 'mailchimp',
    merge_vars: mergeVars,
    bcc_address: 'tihomir@swipesapp.com',
  };

  mandrill_client.messages.sendTemplate({
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
