import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async (teamId, plan) => {
  const teamRes = await query(
    `
      SELECT stripe_subscription_id, stripe_customer_id
      FROM teams
      WHERE team_id = $1
    `,
    [teamId]
  );

  const team = teamRes.rows[0];
  if (!team.stripe_customer_id) {
    throw Error('no_stripe_customer');
  }
  if (team.stripe_subscription_id) {
    throw Error('already_subscribed');
  }

  const userRes = await query(
    `
      SELECT COUNT(user_id)
      FROM team_users
      WHERE team_id = $1
      AND status = 'active'
    `,
    [teamId]
  );

  return await stripeClient.subscriptions.create({
    customer: team.stripe_customer_id,
    plan,
    quantity: userRes.rows[0].count
  });
};
