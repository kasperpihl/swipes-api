import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import userTeamCheck from 'src/utils/userTeamCheck';
import sqlJsonbBuild from 'src/utils/sql/sqlJsonbBuild';

const expectedInput = {
  team_id: string.require(),
  target_email: string.format('email').require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { team_id, target_email } = input;

    // Ensure I have the rights to invite users.
    await userTeamCheck(user_id, team_id, {
      status: 'active'
    });

    const jsonb = sqlJsonbBuild({ [target_email]: null });
    const teamRes = await query(
      `
        UPDATE teams
        SET pending_users = jsonb_strip_nulls(pending_users || ${jsonb})
        WHERE team_id = $1
        RETURNING pending_users, team_id
      `,
      [team_id]
    );

    res.locals.update = update.prepare(team_id, [
      {
        type: 'team',
        data: teamRes.rows[0]
      }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
