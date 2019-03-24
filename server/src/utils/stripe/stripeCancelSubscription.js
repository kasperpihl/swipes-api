import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async teamId => {
  const teamRes = await query(
    `
      SELECT stripe_subscription_id
      FROM teams
      WHERE team_id = $1
    `,
    [teamId]
  );

  const team = teamRes.rows[0];
  if (!team.stripe_subscription_id) {
    return;
  }

  await stripeClient.subscriptions.del(team.stripe_subscription_id);

  await query(
    `
      UPDATE teams
      SET stripe_subscription_id = null
      WHERE team_id = $1
    `,
    [teamId]
  );
};
