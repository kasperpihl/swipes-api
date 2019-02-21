import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';
import { query, transaction } from 'src/utils/db/db';
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
    const [orgRes, orgUserRes] = await transaction([
      {
        text: `
          UPDATE organizations
          SET owner_id = $1
          WHERE organization_id = $2
          RETURNING organization_id, owner_id
        `,
        values: [target_user_id, organization_id]
      },
      {
        text: `
          UPDATE organization_users
          SET admin = true
          WHERE user_id = $1
          AND organization_id = $2
          RETURNING organization_id, user_id, admin
        `,
        values: [target_user_id, organization_id]
      }
    ]);

    res.locals.update = update.prepare(organization_id, [
      { type: 'organization', data: orgRes.rows[0] },
      { type: 'organization_user', data: orgUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
