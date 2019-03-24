import { query } from 'src/utils/db/db';

export default async (user_id, team_id, options) => {
  if (typeof options !== 'object') {
    options = {};
  }

  const userRes = await query(
    `
      SELECT (t.owner_id = tu.user_id) as owner, tu.admin, tu.status FROM team_users tu
      INNER JOIN teams t
      ON t.team_id = tu.team_id
      WHERE tu.user_id = $1
      AND tu.team_id = $2 
    `,
    [user_id, team_id]
  );

  if (!userRes || !userRes.rows.length) {
    throw Error('Not found')
      .code(404)
      .toClient();
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
