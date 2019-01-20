import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  organization_id: string.require(),
  name: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, name } = input;

    // Ensure I have the rights to promote users.
    await userOrganizationCheck(user_id, organization_id, {
      admin: true,
      status: 'active'
    });

    await query(
      `
        UPDATE organizations
        SET
          updated_at = now(),
          name = $1
        WHERE organization_id = $2
      `,
      [name, organization_id]
    );

    // Create response data.
    res.locals.output = {};
  }
);
