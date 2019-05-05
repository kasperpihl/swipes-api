import config from 'config';
import moment from 'moment';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';
import emailIncludeFooter from './emailIncludeFooter';

export default async function emailFridayReminder(email, firstName) {
  const giphyRes = await query(
    'SELECT * FROM giphys ORDER BY random() LIMIT 1'
  );

  const giphy = giphyRes.rows[0];
  const host = config.get('emailHost');

  const mergeVars = {
    NAME: firstName,
    TITLE: giphy.title,
    GIPHY: `<img src="${giphy.url}" />`,
    PLANBUTTON: `${host}?go_to=planNextWeek`,
    FOOTER: emailIncludeFooter(true)
  };

  return mandrillSendTemplate('friday-email-unfinished-tasks', {
    email,
    mergeVars,
    subject: `Week ${moment().week()} is done! Good job`
  });
}
