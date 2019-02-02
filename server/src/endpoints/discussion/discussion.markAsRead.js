import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import { query } from 'src/utils/db/db';

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
          followers = followers || jsonb_build_object('${user_id}', ${sqlToIsoString(
        'last_comment_at'
      )})
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
