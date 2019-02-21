import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import sqlJsonbBuild from 'src/utils/sql/sqlJsonbBuild';

const expectedInput = {
  organization_id: string.require(),
  target_email: string.format('email').require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { organization_id, target_email } = input;

    // Ensure I have the rights to invite users.
    await userOrganizationCheck(user_id, organization_id, {
      status: 'active'
    });

    const jsonb = sqlJsonbBuild({ [target_email]: null });
    const orgRes = await query(
      `
        UPDATE organizations
        SET pending_users = jsonb_strip_nulls(pending_users || ${jsonb})
        WHERE organization_id = $1
        RETURNING pending_users, organization_id
      `,
      [organization_id]
    );

    res.locals.update = update.prepare(organization_id, [
      {
        type: 'organization',
        data: orgRes.rows[0]
      }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
