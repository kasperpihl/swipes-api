import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import update from 'src/utils/update';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import stripeCancelSubscription from 'src/utils/stripe/stripeCancelSubscription';

const expectedInput = {
  organization_id: string.require(),
  password: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, password } = input;

    // Ensure I have the rights to delete organization.
    await userOrganizationCheck(user_id, organization_id, {
      owner: true
    });

    // check if this user is available
    const userRes = await query('SELECT password FROM users WHERE user_id=$1', [
      user_id
    ]);
    const user = userRes.rows[0];

    // Validate password
    const sha1Password = sha1(password);

    if (!user || sha1Password !== user.password) {
      throw Error('Wrong password').toClient();
    }

    await stripeCancelSubscription(organization_id);

    // creating a new user from scratch
    await transaction([
      {
        text: `
          DELETE FROM organizations
          WHERE organization_id = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM projects
          WHERE owned_by = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM discussions
          WHERE owned_by = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE owned_by = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM jobs
          WHERE owned_by = $1
        `,
        values: [organization_id]
      }
    ]);

    res.locals.update = update.prepare(organization_id, [
      { type: 'organization', data: { organization_id, deleted: true } }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
