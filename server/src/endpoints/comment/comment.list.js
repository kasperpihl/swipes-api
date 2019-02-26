import { object, array, string, number, bool } from 'valjs';
import { query } from 'src/utils/db/db';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  discussion_id: string.require(),
  attachments_only: bool,
  skip: number.gte(0),
  limit: number.gte(1).lte(100)
};
const expectedOutput = {
  comments: array.of(object)
};

export default endpointCreate(
  {
    expectedInput,
    expectedOutput
  },
  async (req, res) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { discussion_id, attachments_only, cursor, fetch_new } = input;

    const limit = input.limit || 20;

    const values = [discussion_id, limit + 1];

    let pagination = '';
    if (cursor) {
      pagination = `AND sent_at ${fetch_new ? '>=' : '<='} $3`;
      values.push(cursor);
    }

    const commentRes = await query(
      `
        SELECT discussion_id, comment_id, reactions, message, attachments, sent_by, sent_at
        FROM discussion_comments
        WHERE discussion_id = (
          SELECT permission_from
          FROM permissions
          WHERE permission_from = $1
          AND ${sqlCheckPermissions('granted_to', user_id)}
        )
        ${attachments_only ? 'AND attachments IS NOT NULL' : ''}
        ${pagination}
        ORDER BY sent_at DESC
        LIMIT $2
      `,
      values
    );

    const has_more = commentRes.rows.length > limit;
    const comments = commentRes.rows.slice(0, limit).reverse();

    res.locals.output = {
      comments,
      limit,
      has_more
    };
  }
);
