import { object, array, string } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
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
    await query(
      `
        UPDATE organizations
        SET pending_users = jsonb_strip_nulls(pending_users || ${jsonb})
        WHERE organization_id = $1
      `,
      [organization_id]
    );
    // Create response data.
    res.locals.output = {};
  }
);
