import { object, string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpointCreate';

const expectedInput = {
  discussion_id: string.require()
};
const expectedOutput = {
  discussion: object.require()
};

export default endpointCreate(
  {
    permissionKey: 'discussion_id',
    expectedInput,
    expectedOutput
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const { discussion_id } = res.locals.input;

    const discussionRes = await query(
      `
        SELECT *
        FROM discussions
        WHERE discussion_id = $1
      `,
      [discussion_id]
    );

    if (!discussionRes || !discussionRes.rows.length) {
      throw Error('not_found').code(404);
    }

    // Create response data.
    res.locals.output = {
      discussion: discussionRes.rows[0]
    };
  }
);
