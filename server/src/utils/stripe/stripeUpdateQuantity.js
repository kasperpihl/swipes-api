import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async organizationId => {
  const orgRes = await query(
    `
      SELECT stripe_plan_id, stripe_subscription_id
      FROM organizations
      WHERE organization_id = $1
    `,
    [organizationId]
  );

  const org = orgRes.rows[0];
  if (!org.stripe_subscription_id) {
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
    plan: org.stripe_plan_id,
    quantity: activeUsers
  };

  await stripeClient.subscriptions.update(
    org.stripe_subscription_id,
    subscription
  );
};
