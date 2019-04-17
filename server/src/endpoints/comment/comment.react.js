import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';
import { query } from 'src/utils/db/db';

const expectedInput = {
  discussion_id: string.require(),
  comment_id: string.require(),
  reaction: string
};

export default endpointCreate(
  {
    permissionKey: 'discussion_id',
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { comment_id, reaction, discussion_id } = input;

    const commentRes = await query(
      `
          UPDATE discussion_comments
          SET
            updated_at = now(),
            reactions = ${
              reaction
                ? `reactions || jsonb_build_object('${user_id}', '${reaction}')`
                : `jsonb_strip_nulls(reactions || jsonb_build_object('${user_id}', null))`
            }
            
          WHERE discussion_id = $1
          AND comment_id = $2
          RETURNING discussion_id, comment_id, updated_at, reactions, message
        `,
      [discussion_id, comment_id]
    );

    res.locals.update = update.prepare(discussion_id, [
      {
        type: 'comment',
        data: commentRes.rows[0]
      }
    ]);

    res.locals.output = {
      reaction
    };
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
