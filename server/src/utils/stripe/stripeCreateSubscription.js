import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async (organizationId, plan) => {
  const orgRes = await query(
    `
      SELECT stripe_subscription_id, stripe_customer_id
      FROM organizations
      WHERE organization_id = $1
    `,
    [organizationId]
  );

  const org = orgRes.rows[0];
  if (!org.stripe_customer_id) {
    throw Error('no_stripe_customer');
  }
  if (org.stripe_subscription_id) {
    throw Error('already_subscribed');
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

  return await stripeClient.subscriptions.create({
    customer: org.stripe_customer_id,
    plan,
    quantity: userRes.rows[0].count
  });
};
