import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import update from 'src/utils/update';
import userTeamCheck from 'src/utils/userTeamCheck';
import stripeCancelSubscription from 'src/utils/stripe/stripeCancelSubscription';

const expectedInput = {
  team_id: string.require(),
  password: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { team_id, password } = input;

    // Ensure I have the rights to delete team.
    await userTeamCheck(user_id, team_id, {
      owner: true
    });

    // check if this user is available
    const userRes = await query('SELECT password FROM users WHERE user_id=$1', [
      user_id
    ]);
    const user = userRes.rows[0];

    // Validate password
    const sha1Password = sha1(password);

    if (!user || sha1Password !== user.password) {
      throw Error('Wrong password').toClient();
    }

    await stripeCancelSubscription(team_id);

    // creating a new user from scratch
    await transaction([
      {
        text: `
          DELETE FROM teams
          WHERE team_id = $1
        `,
        values: [team_id]
      },
      {
        text: `
          DELETE FROM projects
          WHERE owned_by = $1
        `,
        values: [team_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE owned_by = $1
        `,
        values: [team_id]
      },
      {
        text: `
          DELETE FROM jobs
          WHERE owned_by = $1
        `,
        values: [team_id]
      },
      {
        text: `
          DELETE FROM notes
          WHERE owned_by = $1
        `,
        values: [team_id]
      },
      {
        text: `
          DELETE FROM files
          WHERE owned_by = $1
        `,
        values: [team_id]
      }
    ]);

    res.locals.update = update.prepare(team_id, [
      { type: 'team', data: { team_id, deleted: true } }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
