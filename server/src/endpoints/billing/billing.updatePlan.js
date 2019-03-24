import { string, any } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import stripeClient from 'src/utils/stripe/stripeClient';
import userTeamCheck from 'src/utils/userTeamCheck';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import stripeGetPlanId from 'src/utils/stripe/stripeGetPlanId';

const expectedInput = {
  team_id: string.require(),
  plan: any.of('monthly', 'yearly')
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id } = res.locals;
    const { team_id, plan } = res.locals.input;

    // Ensure I have the rights to update billing plan.
    await userTeamCheck(user_id, team_id, {
      admin: true,
      status: 'active'
    });

    const teamRes = await query(
      `
        SELECT t.stripe_subscription_id, u.email, t.stripe_plan_id
        FROM teams t
        INNER JOIN users u
        ON u.user_id = t.owner_id
        WHERE t.team_id = $1
      `,
      [team_id]
    );

    const team = teamRes.rows[0];

    if (!team.stripe_subscription_id) {
      throw Error('no_stripe_subscription');
    }

    const stripePlanId = stripeGetPlanId(plan);
    if (stripePlanId === team.stripe_plan_id) {
      throw Error('already_on_plan');
    }

    const subscription = await stripeClient.subscriptions.retrieve(
      team.stripe_subscription_id
    );

    await stripeClient.subscriptions.update(team.stripe_subscription_id, {
      items: [
        {
          id: subscription.items.data[0].id,
          plan: stripePlanId
        }
      ]
    });

    const teamUpdateRes = await query(
      `
        UPDATE teams
        SET
          stripe_plan_id = $1,
          plan = $2
        WHERE team_id = $3
        RETURNING team_id, plan, stripe_plan_id
      `,
      [stripePlanId, plan, team_id]
    );
    res.locals.update = update.prepare(team_id, [
      { type: 'team', data: teamUpdateRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
