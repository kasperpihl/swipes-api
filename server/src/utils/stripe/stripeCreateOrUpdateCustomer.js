import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async (teamId, stripeToken, metadata) => {
  const teamRes = await query(
    `
      SELECT t.stripe_customer_id, t.name, u.email
      FROM teams t
      INNER JOIN users u
      ON u.user_id = t.owner_id
      WHERE t.team_id = $1
    `,
    [teamId]
  );

  const team = teamRes.rows[0];

  const args = [];
  let funcName = 'create';
  if (team.stripe_customer_id) {
    funcName = 'update';
    args.push(team.stripe_customer_id);
  }

  args.push({
    email: team.email,
    source: stripeToken,
    description: team.name,
    metadata
  });

  return await stripeClient.customers[funcName](...args);
};
