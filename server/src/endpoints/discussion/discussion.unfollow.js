import { string } from 'valjs';
import { query } from 'src/utils/db/db';

import endpointCreate from 'src/utils/endpoint/endpointCreate';
// import dbSendUpdates from 'src/utils/db/dbSendUpdates';

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
        RETURNING followers, discussion_id
      `,
      [discussion_id]
    );

    // Create response data.
    res.locals.output = {
      updates: [{ type: 'discussion', data: discussionRes.rows[0] }]
    };
  }
).background(async (req, res) => {
  // dbSendUpdates(res.locals);
});
