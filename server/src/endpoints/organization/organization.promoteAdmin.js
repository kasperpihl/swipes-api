import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';

const expectedInput = {
  organization_id: string.require(),
  target_user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, target_user_id } = input;

    // Ensure I have the rights to promote users.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    // Check that target user exists and is not admin already
    await userOrganizationCheck(target_user_id, organization_id, {
      admin: false,
      status: 'active'
    });

    // creating a new user from scratch
    await query(
      `
        UPDATE organization_users
        SET admin = true
        WHERE organization_id = $1
        AND user_id = $2
      `,
      [organization_id, target_user_id]
    );

    // Create response data.
    res.locals.output = {};
  }
);
