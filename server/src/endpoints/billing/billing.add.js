import { object, array, string, any } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';

const expectedInput = {
  stripe_token: string.require(),
  organization_id: string.require(),
  plan: any.of('monthly', 'yearly')
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id } = res.locals;
    const { organization_id, stripe_token, plan } = res.locals.input;

    // Ensure I have the rights to add billing.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    // Create response data.
    res.locals.output = {};
  }
);
