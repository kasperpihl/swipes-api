import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';

const expectedInput = {
  organization_id: string.require(),
  target_email: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, target_email } = input;

    // Ensure I have the rights to invite users.
    await userOrganizationCheck(user_id, organization_id, {
      status: 'active'
    });

    // Create response data.
    res.locals.output = {};
  }
);
