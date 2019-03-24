import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import userTeamCheck from 'src/utils/userTeamCheck';

const expectedInput = {
  team_id: string.require(),
  target_user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { team_id, target_user_id } = input;

    // Ensure I have the rights to promote users.
    await userTeamCheck(user_id, team_id, {
      admin: true,
      status: 'active'
    });

    // Check that target user exists and is not admin already
    await userTeamCheck(target_user_id, team_id, {
      admin: false,
      status: 'active'
    });

    // creating a new user from scratch
    const teamUserRes = await query(
      `
        UPDATE team_users
        SET admin = true
        WHERE team_id = $1
        AND user_id = $2
        RETURNING user_id, team_id, admin
      `,
      [team_id, target_user_id]
    );

    res.locals.update = update.prepare(team_id, [
      { type: 'team_user', data: teamUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
