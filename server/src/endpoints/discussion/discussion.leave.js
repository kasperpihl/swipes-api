import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';

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

    const discussionRes = await transaction([
      {
        text: `
        UPDATE discussions
        SET
          updated_at = now(),
          members = jsonb_strip_nulls(
            members || jsonb_build_object('${user_id}', null)
          ) 
        WHERE discussion_id = $1
        RETURNING members, discussion_id, last_comment_at
      `,
        values: [discussion_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE permission_from = $1
          AND granted_to = $2 
        `,
        values: [discussion_id, user_id]
      }
    ]);

    res.locals.update = update.prepare(discussion_id, [
      { type: 'discussion', data: discussionRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
