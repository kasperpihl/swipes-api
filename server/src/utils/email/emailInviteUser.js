import config from 'config';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';
import emailIncludeFooter from './emailIncludeFooter';

export default (email, invitationToken, teamName, inviterFirstName) => {
  const host = config.get('emailHost');

  const mergeVars = {
    INVITER: inviterFirstName,
    TEAM: teamName,
    INVITATION_LINK: `${host}register?invitation_token=${invitationToken}`,
    FOOTER: emailIncludeFooter()
  };

  return mandrillSendTemplate('subject-join-your-team-at-swipes', {
    email,
    subject: `${inviterFirstName} invited you to join ${teamName} in Swipes`,
    mergeVars
  });
};
