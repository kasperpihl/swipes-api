import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';
import emailIncludeFooter from './emailIncludeFooter';

export default async function emailOnboarding(email, firstName) {
  const mergeVars = {
    NAME: firstName,
    FOOTER: emailIncludeFooter()
  };

  return mandrillSendTemplate('onboarding-email-1h-after-signup', {
    email,
    mergeVars,
    subject: 'Set up your weekly plan with Swipes'
  });
}
