import { query } from 'src/utils/db/db';

export default async (user_id, organization_id, options) => {
  if (typeof options !== 'object') {
    options = {};
  }

  const userRes = await query(
    `
      SELECT (o.owner_id = ou.user_id) as owner, ou.admin, ou.status FROM organization_users ou
      INNER JOIN organizations o
      ON o.organization_id = ou.organization_id
      WHERE ou.user_id = $1
      AND ou.organization_id = $2 
    `,
    [user_id, organization_id]
  );

  if (!userRes || !userRes.rows.length) {
    throw Error('not_found').code(404);
  }

  const user = userRes.rows[0];

  Object.entries(options).forEach(([key, expectedValue]) => {
    if (typeof expectedValue !== 'undefined' && user[key] !== expectedValue) {
      throw Error('unauthorized').info({
        permission: key,
        value: user[key],
        expectedValue
      });
    }
  });
};
