import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';

const expectedInput = {
  organization_id: string.require(),
  target_user_id: string.require(),
  password: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, target_user_id, password } = input;

    // check if this user is available
    const userRes = await query('SELECT password FROM users WHERE user_id=$1', [
      user_id
    ]);
    const user = userRes.rows[0];

    // Validate password
    const sha1Password = sha1(password);

    if (!user || sha1Password !== user.password) {
      throw Error('unauthorized');
    }

    // Ensure I have the rights to transfer ownership.
    await userOrganizationCheck(user_id, organization_id, {
      owner: true
    });

    // Check that target user exists and is not owner.
    await userOrganizationCheck(target_user_id, organization_id, {
      owner: false
    });

    // creating a new user from scratch
    await query(
      `
        UPDATE organizations
        SET owner_id = $1
        WHERE organization_id = $2
      `,
      [target_user_id, organization_id]
    );

    // Create response data.
    res.locals.output = {};
  }
);
