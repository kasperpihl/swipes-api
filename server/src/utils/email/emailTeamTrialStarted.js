import config from 'config';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';
import emailIncludeFooter from './emailIncludeFooter';

export default async function emailOnboarding(
  email,
  firstName,
  teamName,
  teamId
) {
  const host = config.get('emailHost');
  const mergeVars = {
    NAME: firstName,
    TEAM: teamName,
    FOOTER: emailIncludeFooter(),
    TEAM_LINK: `${host}?go_to=team-${teamId}`
  };

  return mandrillSendTemplate('your-30-day-trial-for-swipes-starts-today', {
    email,
    mergeVars,
    subject: 'Your 30-day trial for Swipes starts today'
  });
}
