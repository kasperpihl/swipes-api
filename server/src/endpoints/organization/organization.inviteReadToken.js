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
      throw Error('Invalid token').toClient();
    }

    const {
      sub: team_id,
      aud: email,
      exp,
      iss: invited_by_user_id
    } = parsedToken.tokenContent;

    const teamRes = await query(
      `
        SELECT t.team_id, t.pending_users, t.name
        FROM teams t
        WHERE t.team_id = $1
      `,
      [team_id]
    );
    const team = teamRes.rows[0];

    const now = Math.floor(Date.now() / 1000);
    if (!team.pending_users[email] || exp < now) {
      throw Error('Invalid token')
        .info(team)
        .toClient();
    }
    delete team.pending_users;
    team.invitation_token = invitation_token;
    team.invited_by_user_id = invited_by_user_id;

    // Create response data.
    res.locals.output = { team: team };
  }
);
