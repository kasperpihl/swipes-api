import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';
import { query, transaction } from 'src/utils/db/db';
import userTeamCheck from 'src/utils/userTeamCheck';

const expectedInput = {
  team_id: string.require(),
  target_user_id: string.require(),
  password: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { team_id, target_user_id, password } = input;

    // check if this user is available
    const userRes = await query('SELECT password FROM users WHERE user_id=$1', [
      user_id
    ]);
    const user = userRes.rows[0];

    // Validate password
    const sha1Password = sha1(password);

    if (!user || sha1Password !== user.password) {
      throw Error('unauthorized');
    }

    // Ensure I have the rights to transfer ownership.
    await userTeamCheck(user_id, team_id, {
      owner: true
    });

    // Check that target user exists and is not owner.
    await userTeamCheck(target_user_id, team_id, {
      owner: false
    });

    // creating a new user from scratch
    const [teamRes, teamUserRes] = await transaction([
      {
        text: `
          UPDATE teams
          SET owner_id = $1
          WHERE team_id = $2
          RETURNING team_id, owner_id
        `,
        values: [target_user_id, team_id]
      },
      {
        text: `
          UPDATE team_users
          SET admin = true
          WHERE user_id = $1
          AND team_id = $2
          RETURNING team_id, user_id, admin
        `,
        values: [target_user_id, team_id]
      }
    ]);

    res.locals.update = update.prepare(team_id, [
      { type: 'team', data: teamRes.rows[0] },
      { type: 'team_user', data: teamUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
