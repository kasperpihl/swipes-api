import { string } from 'valjs';
import stripeClient from 'src/utils/stripe/stripeClient';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  stripe_token: string.require(),
  organization_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const { organization_id, stripe_token } = res.locals.input;

    // Ensure I have the rights to update billing.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    const orgRes = await query(
      `
        SELECT stripe_customer_id
        FROM organizations
        WHERE organization_id = $1
      `,
      [organization_id]
    );
    const org = orgRes.rows[0];

    if (!org.stripe_customer_id) {
      throw Error('not_stripe_customer');
    }

    await stripeClient.customers.update(org.stripe_customer_id, {
      source: stripe_token
    });

    // Create response data.
    res.locals.output = {};
  }
);
