import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';
import { query } from 'src/utils/db/db';

const expectedInput = {
  discussion_id: string.min(1).require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res) => {
    // Get inputs
    const { input } = res.locals;
    const { discussion_id } = input;

    const discussionRes = await query(
      `
        UPDATE discussions
        SET archived = true
        WHERE discussion_id = $1

        RETURNING discussion_id, archived
      `,
      [discussion_id]
    );

    if (!discussionRes || !discussionRes.rows.length) {
      throw Error('Not found').code(404);
    }

    res.locals.update = update.prepare(discussion_id, [
      { type: 'discussion', data: discussionRes.rows[0] }
    ]);
    res.locals.messageGroupId = discussion_id;
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
