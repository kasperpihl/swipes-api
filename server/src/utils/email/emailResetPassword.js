import config from 'config';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';
import emailIncludeFooter from './emailIncludeFooter';

export default (email, firstName, token) => {
  const host = config.get('emailHost');
  const mergeVars = {
    NAME: firstName,
    RESET_PASSWORD_URL: `${host}reset.html?token=${token}`,
    FOOTER: emailIncludeFooter()
  };

  return mandrillSendTemplate('reset-password', {
    email,
    subject: 'Reset password for Swipes Workspace',
    mergeVars
  });
};
