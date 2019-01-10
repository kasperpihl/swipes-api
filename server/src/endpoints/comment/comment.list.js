import { object, array, string, number } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpointCreate';

const expectedInput = {
  discussion_id: string.require(),
  skip: number.gte(0),
  limit: number.gte(1).lte(100)
};
const expectedOutput = {
  comments: array.of(object)
};

export default endpointCreate(
  {
    endpoint: '/comment.list',
    expectedInput,
    expectedOutput
  },
  async (req, res) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { discussion_id } = input;

    const skip = input.skip || 0;
    const limit = input.limit || 20;

    const commentsRes = await query(
      `
        SELECT discussion_id, comment_id, reactions, message, attachments, sent_by, sent_at
        FROM discussion_comments
        WHERE discussion_id = (
          SELECT permission_id
          FROM permissions
          WHERE permission_id = $1
          AND granted_to = (
            SELECT permission_to
            FROM user_permissions
            WHERE user_id = $2
          )
        )
        ORDER BY sent_at DESC
        LIMIT $3
        OFFSET $4
      `,
      [discussion_id, user_id, limit + 1, skip]
    );
    let comments = commentsRes.rows;

    let has_more = false;
    if (comments.length >= limit + 1) {
      has_more = true;
      comments = comments.slice(0, limit);
    }

    res.locals.output = {
      comments,
      skip,
      limit,
      has_more
    };
  }
);
