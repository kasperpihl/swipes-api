import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import update from 'src/utils/update';
import userTeamCheck from 'src/utils/userTeamCheck';
import stripeUpdateQuantity from 'src/utils/stripe/stripeUpdateQuantity';

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

    // Allow to disable your self (leave team)
    if (target_user_id !== user_id) {
      // Ensure I have the rights to disable users.
      await userTeamCheck(user_id, team_id, {
        admin: true,
        status: 'active'
      });
    }

    // Check that target user exists and is not owner.
    await userTeamCheck(target_user_id, team_id, {
      owner: false
    });

    // creating a new user from scratch
    const [teamUserRes] = await transaction([
      {
        text: `
          UPDATE team_users
          SET
            status = 'disabled',
            admin = false
          WHERE team_id = $1
          AND user_id = $2
          RETURNING user_id, team_id, admin, status
        `,
        values: [team_id, target_user_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE owned_by = $1
          AND granted_to = $2
        `,
        values: [team_id, target_user_id]
      }
    ]);

    res.locals.backgroundInput = {
      team_id
    };

    res.locals.update = update.prepare(team_id, [
      { type: 'team_user', data: teamUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  const { team_id } = res.locals.input;
  await stripeUpdateQuantity(team_id);
});
