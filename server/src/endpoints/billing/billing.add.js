import { string, any } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import userTeamCheck from 'src/utils/userTeamCheck';
import stripeGetPlanId from 'src/utils/stripe/stripeGetPlanId';
import stripeCreateOrUpdateCustomer from 'src/utils/stripe/stripeCreateOrUpdateCustomer';
import stripeCreateSubscription from 'src/utils/stripe/stripeCreateSubscription';
import queueCancelBatch from 'src/utils/queue/queueCancelBatch';

const expectedInput = {
  stripe_token: string.require(),
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
    const { team_id, stripe_token, plan } = res.locals.input;

    // Ensure I have the rights to add billing.
    await userTeamCheck(user_id, team_id, {
      admin: true,
      status: 'active'
    });

    const customer = await stripeCreateOrUpdateCustomer(team_id, stripe_token, {
      plan
    });

    await query(
      `
        UPDATE teams
        SET
          updated_at = now(),
          stripe_customer_id = $1
        WHERE team_id = $2
      `,
      [customer.id, team_id]
    );

    const stripePlanId = stripeGetPlanId(plan);

    const subscription = await stripeCreateSubscription(team_id, stripePlanId);

    const teamRes = await query(
      `
        UPDATE teams
        SET
          updated_at = now(),
          stripe_subscription_id = $1,
          stripe_plan_id = $2,
          plan = $3
        WHERE team_id = $4
        RETURNING plan, updated_at, team_id, stripe_plan_id, stripe_subscription_id, stripe_customer_id
      `,
      [subscription.id, stripePlanId, plan, team_id]
    );

    res.locals.update = update.prepare(team_id, [
      { type: 'team', data: teamRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  await queueCancelBatch(
    ['trial-1week', 'trial-1day', 'trial-expired'].map(email => ({
      owned_by: team_id,
      job_name: 'job.sendEmail.queue',
      unique_identifier: email
    }))
  );
});
