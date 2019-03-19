import { string, any } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import stripeGetPlanId from 'src/utils/stripe/stripeGetPlanId';
import stripeCreateOrUpdateCustomer from 'src/utils/stripe/stripeCreateOrUpdateCustomer';
import stripeCreateSubscription from 'src/utils/stripe/stripeCreateSubscription';
import queueCancelBatch from 'src/utils/queue/queueCancelBatch';

const expectedInput = {
  stripe_token: string.require(),
  organization_id: string.require(),
  plan: any.of('monthly', 'yearly')
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id } = res.locals;
    const { organization_id, stripe_token, plan } = res.locals.input;

    // Ensure I have the rights to add billing.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    const customer = await stripeCreateOrUpdateCustomer(
      organization_id,
      stripe_token,
      { plan }
    );

    await query(
      `
        UPDATE organizations
        SET
          updated_at = now(),
          stripe_customer_id = $1
        WHERE organization_id = $2
      `,
      [customer.id, organization_id]
    );

    const stripePlanId = stripeGetPlanId(plan);

    const subscription = await stripeCreateSubscription(
      organization_id,
      stripePlanId
    );

    const orgRes = await query(
      `
        UPDATE organizations
        SET
          updated_at = now(),
          stripe_subscription_id = $1,
          stripe_plan_id = $2,
          plan = $3
        WHERE organization_id = $4
        RETURNING plan, updated_at, organization_id, stripe_plan_id, stripe_subscription_id, stripe_customer_id
      `,
      [subscription.id, stripePlanId, plan, organization_id]
    );

    res.locals.update = update.prepare(organization_id, [
      { type: 'organization', data: orgRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  await queueCancelBatch(
    ['trial-1week', 'trial-1day', 'trial-expired'].map(identifier => ({
      owned_by: organization_id,
      job_name: 'job.sendEmail',
      identifier
    }))
  );
});
