import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require(),
  title: string.min(1).require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res) => {
    // Get inputs
    const { discussion_id, title } = res.locals.input;

    const discussionRes = await query(
      `
        UPDATE discussions
        SET
          updated_at = now()
          title = $1
        WHERE discussion_id = $2
        RETURNING discussion_id, updated_at, title
      `,
      [title, discussion_id]
    );

    // Create response data.
    res.locals.update = update.prepare(discussion_id, [
      {
        type: 'discussion',
        data: discussionRes.rows[0]
      }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
