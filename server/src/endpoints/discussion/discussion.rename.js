import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import { query } from 'src/utils/db/db';

const expectedInput = {
  discussion_id: string.require(),
  topic: string.min(1).require()
};

export default endpointCreate(
  {
    endpoint: '/discussion.rename',
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res) => {
    // Get inputs
    const { discussion_id, topic } = res.locals.input;

    const discussionRes = await query(
      `
        UPDATE discussions
        SET
          updated_at = now()
          topic = $1
        WHERE discussion_id = $2
        RETURNING discussion_id, updated_at, topic
      `,
      [topic, discussion_id]
    );

    // Create response data.
    res.locals.output = {
      updates: [
        {
          type: 'discussion',
          data: discussionRes.rows[0]
        }
      ]
    };
  }
).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
