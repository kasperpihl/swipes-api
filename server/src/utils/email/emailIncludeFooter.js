import moment from 'moment';

export default function emailIncludeFooter(includeUnsub) {
  return `
    <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #A8A8A8;">
      <strong>Our mailing address is:</strong><br>
      3333 Coyote Hill Rd, Palo Alto, CA 94304, USA<br>
      <br>
      ${
        includeUnsub
          ? `
      Want to change how you receive these emails?<br>
      You can <a href="*|UPDATE_PROFILE|*">update your preferences</a> or <a href="*|UNSUB|*">unsubscribe from this list</a>.<br>
      <br>You are receiving this email either because you've opted in at our website https://swipesapp.com or have registered to use one of our products from Swipes.
      <br>
      `
          : ''
      }
      <br>
      <em>Copyright © ${moment().year()} Swipes Incorporated, All rights reserved.</em>
    </td>
  `;
}
