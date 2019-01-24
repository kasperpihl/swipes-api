import { object, string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import idGenerate from 'src/utils/idGenerate';

const expectedInput = {
  owned_by: string.require(),
  title: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { owned_by, title } = input;

    const noteId = idGenerate('N', 20);

    const noteRes = await query(
      sqlInsertQuery('notes', {
        note_id: noteId,
        owned_by,
        title,
        created_by: user_id,
        updated_by: user_id
      })
    );

    // Create response data.
    res.locals.output = {
      note: noteRes.rows[0]
    };
  }
);
