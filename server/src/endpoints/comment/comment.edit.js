import { object, array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require(),
  comment_id: string.require(),
  message: string.require(),
  attachments: array.of(
    object
      .as({
        type: any.of('file', 'note', 'url'),
        id: string.require(),
        title: string.require(),
        meta: object
      })
      .require()
  )
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { discussion_id, comment_id, message, attachments } = input;

    const parsedAttachments =
      (attachments && attachments.length && JSON.stringify(attachments)) ||
      null;
    // Inserting the comment object.
    const commentRes = await query(
      `
        UPDATE discussion_comments
        SET
          updated_at = now(),
          message = $1,
          attachments = $2
        WHERE discussion_id = $3
        AND comment_id = $4
        AND sent_by = $5
        RETURNING discussion_id, comment_id, updated_at, deleted
      `,
      [message, parsedAttachments, discussion_id, comment_id, user_id]
    );

    if (!commentRes.rows.length) {
      throw Error('Not found').code(404);
    }

    // Create response data.
    res.locals.update = update.prepare(discussion_id, [
      { type: 'comment', data: commentRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
