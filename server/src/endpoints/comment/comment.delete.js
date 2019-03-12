import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require(),
  comment_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { discussion_id, comment_id } = input;
    // Inserting the comment object.
    const commentRes = await query(
      `
        UPDATE discussion_comments
        SET
          updated_at = now(),
          deleted = true
        WHERE discussion_id = $1
        AND comment_id = $2
        AND sent_by = $3
        RETURNING discussion_id, comment_id, updated_at, deleted
      `,
      [discussion_id, comment_id, user_id]
    );
    if (!commentRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    // Create response data.
    res.locals.update = update.prepare(discussion_id, [
      { type: 'comment', data: commentRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
