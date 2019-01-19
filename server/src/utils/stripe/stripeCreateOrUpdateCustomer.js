import stripeClient from 'src/utils/stripe/stripeClient';
import { query } from 'src/utils/db/db';

export default async (organizationId, stripeToken, metadata) => {
  const orgRes = await query(
    `
      SELECT o.stripe_customer_id, o.name, u.email
      FROM organizations o
      INNER JOIN users u
      ON u.user_id = o.owner_id
      WHERE o.organization_id = $1
    `,
    [organizationId]
  );

  const org = orgRes.rows[0];

  const args = [];
  let funcName = 'create';
  if (org.stripe_customer_id) {
    funcName = 'update';
    args.push(org.stripe_customer_id);
  }

  args.push({
    email: org.email,
    source: stripeToken,
    description: org.name,
    metadata
  });

  return await stripeClient.customers[funcName](...args);
};
