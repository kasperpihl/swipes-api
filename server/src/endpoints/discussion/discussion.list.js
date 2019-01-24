import { any, number } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';

import { query } from 'src/utils/db/db';

const expectedInput = {
  type: any.of('following', 'all other').require(),
  skip: number.gte(0),
  limit: number.gte(1).lte(100)
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { type } = input;
    let { skip, limit } = input;
    skip = skip || 0;
    limit = limit || 20;

    const discussionsRes = await query(
      `
        SELECT d.discussion_id, d.topic, d.owned_by, d.created_by, d.updated_at, d.last_comment, d.last_comment_at, d.last_comment_by, d.deleted, d.followers
        FROM permissions as per
        INNER JOIN discussions as d
        ON d.discussion_id = per.permission_id
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
        AND d.followers->>$1 IS ${type === 'all other' ? 'NULL' : 'NOT NULL'}
        AND d.deleted=FALSE
        ORDER BY d.last_comment_at DESC
        LIMIT $2
        OFFSET $3
      `,
      [user_id, limit + 1, skip]
    );
    let discussions = discussionsRes.rows;

    let has_more = false;
    if (discussions.length >= limit + 1) {
      has_more = true;
      discussions = discussions.slice(0, limit);
    }

    res.locals.output = {
      discussions,
      skip,
      limit,
      has_more
    };
  }
);
