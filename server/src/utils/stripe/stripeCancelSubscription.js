import config from 'config';
import stripePackage from 'stripe';
import { query } from 'src/utils/db/db';

const stripeConfig = config.get('stripe');
const stripe = stripePackage(stripeConfig.secretKey);

export default async organizationId => {
  const orgRes = await query(
    `
      SELECT stripe_subscription_id
      FROM organizations
      WHERE organization_id = $1
    `,
    [organizationId]
  );

  const org = orgRes.rows[0];
  if (!org.stripe_subscription_id) {
    return;
  }

  await stripe.subscription.del(org.stripe_subscription_id);

  await query(
    `
      UPDATE organizations
      SET stripe_subscription_id = null
      WHERE organization_id = $1
    `,
    [organizationId]
  );
};
