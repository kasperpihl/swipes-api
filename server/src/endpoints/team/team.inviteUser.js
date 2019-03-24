import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import userTeamCheck from 'src/utils/userTeamCheck';
import tokenCreate from 'src/utils/token/tokenCreate';
import emailInviteUser from 'src/utils/email/emailInviteUser';

const expectedInput = {
  team_id: string.require(),
  target_email: string.format('email').require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { team_id, target_email } = input;

    // Ensure I have the rights to invite users.
    await userTeamCheck(user_id, team_id, {
      status: 'active'
    });

    const teamRes = await query(
      `
        SELECT tu.status, t.name, t.pending_users, u.user_id, iu.email as inviter_email, iu.first_name as inviter_first_name
        FROM teams t
        LEFT JOIN users u
        ON email = $1
        LEFT JOIN users iu
        ON iu.user_id = $2
        LEFT JOIN team_users tu
        ON tu.user_id = u.user_id
        AND tu.team_id = t.team_id
        WHERE t.team_id = $3
      `,
      [target_email, user_id, team_id]
    );

    const team = teamRes.rows[0];
    if (team.status === 'active') {
      throw Error('Already in team').toClient();
    }

    const lastSent = team.pending_users[target_email];
    // Only send an invitation email every 24 hours at max.
    if (lastSent && lastSent + 24 * 60 * 60 > Math.floor(Date.now() / 1000)) {
      throw Error("Can't resend. Too soon.").toClient();
    }

    const inviteToken = tokenCreate('sw-i', {
      iss: user_id,
      aud: target_email,
      sub: team_id,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    });

    const now = Math.floor(Date.now() / 1000);
    const teamUpdateRes = await query(
      `
          UPDATE teams
          SET pending_users = pending_users || jsonb_build_object('${target_email}', ${now})
          WHERE team_id = $1
          RETURNING pending_users, team_id
        `,
      [team_id]
    );

    res.locals.backgroundInput = {
      email: target_email,
      inviteToken,
      teamName: team.name,
      inviterFirstName: team.inviter_first_name,
      inviterEmail: team.inviter_email
    };

    res.locals.update = update.prepare(team_id, [
      {
        type: 'team',
        data: teamUpdateRes.rows[0]
      }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  const {
    email,
    inviteToken,
    teamName,
    inviterFirstName,
    inviterEmail
  } = res.locals.input;

  if (email) {
    await emailInviteUser(
      email,
      inviteToken,
      teamName,
      inviterFirstName || inviterEmail
    );
  }
});
