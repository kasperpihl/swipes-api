import { string, any } from 'valjs';
import { query } from 'src/utils/db/db';
import stripeClient from 'src/utils/stripe/stripeClient';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import stripeGetPlanId from 'src/utils/stripe/stripeGetPlanId';

const expectedInput = {
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
    const { organization_id, plan } = res.locals.input;

    // Ensure I have the rights to update billing plan.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    const orgRes = await query(
      `
        SELECT o.stripe_subscription_id, u.email, o.stripe_plan_id
        FROM organizations o
        INNER JOIN users u
        ON u.user_id = o.owner_id
        WHERE o.organization_id = $1
      `,
      [organization_id]
    );

    const org = orgRes.rows[0];

    if (!org.stripe_subscription_id) {
      throw Error('no_stripe_subscription');
    }

    const stripePlanId = stripeGetPlanId(plan);
    if (stripePlanId === org.stripe_plan_id) {
      throw Error('already_on_plan');
    }

    const subscription = await stripeClient.subscriptions.retrieve(
      org.stripe_subscription_id
    );

    await stripeClient.subscriptions.update(org.stripe_subscription_id, {
      items: [
        {
          id: subscription.items.data[0].id,
          plan: stripePlanId
        }
      ]
    });

    await query(
      `
        UPDATE organizations
        SET
          stripe_plan_id = $1,
          plan = $2
        WHERE organization_id = $3
      `,
      [stripePlanId, plan, organization_id]
    );

    // Create response data.
    res.locals.output = {};
  }
);
