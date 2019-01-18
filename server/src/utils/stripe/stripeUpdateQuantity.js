import config from 'config';
import stripePackage from 'stripe';
import { query } from 'src/utils/db/db';

const stripeConfig = config.get('stripe');
const stripe = stripePackage(stripeConfig.secretKey);

export default async organizationId => {
  const orgRes = await query(
    `
      SELECT plan, stripe_subscription_id, stripe_customer_id
      FROM organizations
      WHERE organization_id = $1
    `,
    [organizationId]
  );

  const org = orgRes.rows[0];
  if (!org.stripe_subscription_id || org.stripe_customer_id) {
    return;
  }

  const userRes = await query(
    `
      SELECT COUNT(user_id)
      FROM organization_users
      WHERE organization_id = $1
      AND status = 'active'
    `,
    [organizationId]
  );

  const activeUsers = userRes.rows[0].count;

  const subscription = {
    plan:
      org.plan === 'yearly'
        ? stripeConfig.yearlyPlanId
        : stripeConfig.monthlyPlanId,
    quantity: activeUsers
  };

  await stripe.subscription.update(org.stripe_subscription_id, subscription);
};
