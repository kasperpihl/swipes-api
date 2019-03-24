import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import userTeamCheck from 'src/utils/userTeamCheck';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  team_id: string.require(),
  name: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { team_id, name } = input;

    // Ensure I have the rights to promote users.
    await userTeamCheck(user_id, team_id, {
      admin: true,
      status: 'active'
    });

    const teamRes = await query(
      `
        UPDATE teams
        SET
          updated_at = now(),
          name = $1
        WHERE team_id = $2
        RETURNING team_id, name, updated_at
      `,
      [name, team_id]
    );

    res.locals.update = update.prepare(team_id, [
      { type: 'team', data: teamRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
