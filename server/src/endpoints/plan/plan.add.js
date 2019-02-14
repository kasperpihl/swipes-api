import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import { string, array, any } from 'valjs';

const expectedInput = {
  title: string.min(1).require(),
  owned_by: string.require(),
  privacy: any.of('public', 'private'),
  members: array.of(string)
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    const { user_id } = res.locals;
    const {
      title,
      owned_by,
      members = [],
      privacy = 'public'
    } = res.locals.input;

    const planId = idGenerate('PLAN-', 8);

    const userIds = [...new Set(members).add(user_id)];

    const [planRes] = await transaction([
      sqlInsertQuery('plans', {
        owned_by,
        title,
        plan_id: planId,
        created_by: user_id
      }),
      sqlPermissionInsertQuery(planId, privacy, owned_by, userIds)
    ]);

    res.locals.output = {
      updates: [{ type: 'plan', data: planRes.rows[0] }]
    };
  }
);
