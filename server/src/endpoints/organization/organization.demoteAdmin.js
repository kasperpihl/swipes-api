import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
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

    // Ensure I have the rights to demote users.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    // Check that target user exists and is not owner.
    await userOrganizationCheck(target_user_id, organization_id, {
      owner: false
    });

    // creating a new user from scratch
    await query(
      `
        UPDATE organization_users
        SET admin = false
        WHERE organization_id = $1
        AND user_id = $2
      `,
      [organization_id, target_user_id]
    );

    // Create response data.
    res.locals.output = {};
  }
);
