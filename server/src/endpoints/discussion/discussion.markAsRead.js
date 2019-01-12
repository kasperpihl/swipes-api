import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';

const expectedInput = {
  discussion_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res) => {
    const { user_id } = res.locals;
    const { discussion_id } = res.locals.input;

    const discussionRes = await query(
      `
        UPDATE discussions
        SET
          updated_at = now(),
          followers = followers || jsonb_build_object('${user_id}', last_comment_at)
        WHERE discussion_id = $1
        RETURNING followers, discussion_id
      `,
      [discussion_id]
    );

    // Create response data.
    res.locals.output = {
      updates: [{ type: 'discussion', data: discussionRes.rows[0] }]
    };
  }
);
