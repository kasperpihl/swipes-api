import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require(),
  user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const { discussion_id } = res.locals.input;

    const discussionRes = await query(
      `
        UPDATE discussions
        SET
          updated_at = now(),
          followers = followers || jsonb_build_object('${user_id}', ${sqlToIsoString(
        'last_comment_at'
      )})
        WHERE discussion_id = $1
        RETURNING followers, discussion_id
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
