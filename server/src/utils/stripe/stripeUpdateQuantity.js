import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async teamId => {
  const teamRes = await query(
    `
      SELECT stripe_plan_id, stripe_subscription_id
      FROM teams
      WHERE team_id = $1
    `,
    [teamId]
  );

  const team = teamRes.rows[0];
  if (!team.stripe_subscription_id) {
    return;
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

  const activeUsers = userRes.rows[0].count;

  const subscription = {
    plan: team.stripe_plan_id,
    quantity: activeUsers
  };

  await stripeClient.subscriptions.update(
    team.stripe_subscription_id,
    subscription
  );
};
