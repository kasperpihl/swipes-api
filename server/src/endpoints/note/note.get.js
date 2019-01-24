import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';

import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  note_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { note_id } = input;

    const noteRes = await query(
      `
        SELECT note_id, owned_by, title, text, rev, updated_at, updated_by
        FROM notes
        WHERE note_id = $1
        AND ${sqlCheckPermissions('owned_by', user_id)}
      `,
      [note_id]
    );

    if (!noteRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    // Create response data.
    res.locals.output = {
      note: noteRes.rows[0]
    };
  }
);
