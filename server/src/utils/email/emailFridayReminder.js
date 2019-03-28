import config from 'config';
import moment from 'moment';
import mandrillSendTemplate from 'src/utils/mandrill/mandrillSendTemplate';

export default async function emailFridayReminder(email, firstName) {
  const giphyCounter = await query(`SELECT count(giphy_id) from giphys`);
  const randomGiphy = giphyCounter.rows[0];
  const giphyId = Math.max(1, Math.floor(Math.random() * count));
  const giphyRes = await query(
    `
      SELECT *
      FROM giphys
      WHERE giphy_id = $1
    `,
    [giphyId]
  );
  const host = config.get('emailHost');
  const template_name = 'friday-email-unfinished-tasks';
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
          name: 'TITLE',
          content: giphy.title
        },
        {
          name: 'GIPHY',
          content: `<img src="${giphy.url}" />`
        },
        {
          name: 'PLANBUTTON',
          content: `${host}?go_to=planNextWeek`
        },
        {
          name: 'FOOTER',
          content: `
          <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #A8A8A8;">
            <strong>Our mailing address is:</strong><br>
            3333 Coyote Hill Rd, Palo Alto, CA 94304, USA<br>
            <br>
            Want to change how you receive these emails?<br>
            You can <a href="*|UPDATE_PROFILE|*">update your preferences</a> or <a href="*|UNSUB|*">unsubscribe from this list</a>.<br>
            <br>You are receiving this email either because you've opted in at our website https://swipesapp.com or have registered to use one of our products from Swipes.
            <br>
            <br>
            <em>Copyright © ${moment().year()} Swipes Incorporated, All rights reserved.</em>
      </td>
          `
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
  const subject = `Week ${moment().week()} is done! Good job`;
  const message = {
    to,
    subject,
    merge_vars,
    from_email: 'help@swipesapp.com',
    from_name: 'Swipes Team',
    important: false,
    merge: true,
    merge_language: 'mailchimp'
  };

  return mandrillSendTemplate({
    template_name,
    template_content,
    message
  });
}
