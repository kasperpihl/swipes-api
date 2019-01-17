import { object, array, string } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import tokenParse from 'src/utils/token/tokenParse';

const expectedInput = {
  invitation_token: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    // Get inputs
    const { input } = res.locals;
    const { invitation_token } = input;
    const parsedToken = tokenParse('sw-i', invitation_token);

    if (!parsedToken || !parsedToken.tokenContent) {
      throw Error('invalid_token');
    }

    const {
      sub: organization_id,
      aud: email,
      exp,
      iss: invited_by_user_id
    } = parsedToken.tokenContent;

    const orgRes = await query(
      `
        SELECT o.organization_id, o.pending_users, o.name
        FROM organizations o
        WHERE o.organization_id = $1
      `,
      [organization_id]
    );
    const org = orgRes.rows[0];

    const now = Math.floor(Date.now() / 1000);
    if (!org.pending_users[email] || exp < now) {
      throw Error('invalid_token').info(org);
    }
    delete org.pending_users;
    org.invitation_token = invitation_token;
    org.invited_by_user_id = invited_by_user_id;

    // Create response data.
    res.locals.output = { organization: org };
  }
);
