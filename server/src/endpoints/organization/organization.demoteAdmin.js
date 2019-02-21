import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
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
    const orgUserRes = await query(
      `
        UPDATE organization_users
        SET admin = false
        WHERE organization_id = $1
        AND user_id = $2
        RETURNING user_id, organization_id, admin
      `,
      [organization_id, target_user_id]
    );

    res.locals.update = update.prepare(organization_id, [
      { type: 'organization_user', data: orgUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
