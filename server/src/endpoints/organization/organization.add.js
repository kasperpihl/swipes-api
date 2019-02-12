import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import idGenerate from 'src/utils/idGenerate';

const expectedInput = {
  name: string.min(1).require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { name } = input;

    const organizationId = idGenerate('ORG-');
    // creating a new user from scratch
    const [organizationRes, userRes] = await transaction([
      sqlInsertQuery('organizations', {
        organization_id: organizationId,
        name,
        owner_id: user_id
      }),
      sqlInsertQuery('organization_users', {
        organization_id: organizationId,
        user_id: user_id,
        admin: true,
        status: 'active'
      })
    ]);

    // Create response data.
    res.locals.output = {
      organization: organizationRes.rows[0],
      user: userRes.rows[0]
    };
  }
);
