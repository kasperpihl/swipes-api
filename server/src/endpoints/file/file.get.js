import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  file_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { file_id } = input;

    const fileRes = await query(
      `
        SELECT file_id, owned_by, title, file_name, s3_url, content_type
        FROM files
        WHERE file_id = $1
        AND owned_by
        IN (
          SELECT permission_to
          FROM user_permissions
          WHERE user_id = $2
        )
      `,
      [file_id, user_id]
    );

    if (!fileRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    // Create response data.
    res.locals.output = {
      file: fileRes.rows[0]
    };
  }
);
