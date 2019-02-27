import { string } from 'valjs';
import { query } from 'src/utils/db/db';

import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id } = res.locals;
    const { discussion_id } = res.locals.input;

    const discussionRes = await query(
      `
        UPDATE discussions
        SET
          updated_at = now(),
          followers = jsonb_strip_nulls(
            followers || jsonb_build_object('${user_id}', null)
          ) 
        WHERE discussion_id = $1
        RETURNING followers, discussion_id, last_comment_at
      `,
      [discussion_id]
    );

    res.locals.update = update.prepare(discussion_id, [
      { type: 'discussion', data: discussionRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
