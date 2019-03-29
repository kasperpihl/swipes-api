import { any, number, string, bool } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';

import { query } from 'src/utils/db/db';

const expectedInput = {
  type: any.of('following', 'all other').require(),
  cursor: string,
  fetch_new: bool,
  limit: number.gte(1).lte(100)
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { type, cursor, fetch_new } = input;

    const limit = input.limit || 20;

    const values = [user_id, limit + 1];

    let pagination = '';
    if (cursor) {
      pagination = `AND d.last_comment_at ${fetch_new ? '>=' : '<='} $3`;
      values.push(cursor);
    }

    const discussionsRes = await query(
      `
        SELECT d.discussion_id, d.title, d.owned_by, d.created_by, d.updated_at, d.last_comment, d.last_comment_at, d.last_comment_by, d.deleted, d.members, d.privacy
        FROM permissions as per
        INNER JOIN discussions as d
        ON d.discussion_id = per.permission_from
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
        AND d.members->>$1 IS ${type === 'all other' ? 'NULL' : 'NOT NULL'}
        AND d.deleted=FALSE
        ${pagination}
        ORDER BY d.last_comment_at DESC
        LIMIT $2
      `,
      values
    );

    const has_more = discussionsRes.rows.length > limit;
    const discussions = discussionsRes.rows.slice(0, limit);

    res.locals.output = {
      discussions,
      limit,
      has_more
    };
  }
);
