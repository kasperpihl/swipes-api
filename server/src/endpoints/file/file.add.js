import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import mime from 'mime-types';
import slug from 'slug';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

slug.defaults.mode = 'rfc3986';

const expectedInput = {
  owned_by: string.require(),
  file_name: string.require(),
  s3_url: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    // expectedOutput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { owned_by, file_name, s3_url } = input;

    const slugFileFame = slug(file_name);
    const fileId = idGenerate('F', 10);
    const nameArr = slugFileFame.split('.');
    const ext = nameArr[nameArr.length - 1];
    const contentType = mime.lookup(ext) || 'application/octet-stream';

    const fileRes = await query(
      sqlInsertQuery('files', {
        file_id: fileId,
        file_name: slugFileFame,
        content_type: contentType,
        s3_url,
        created_by: user_id,
        owned_by
      })
    );

    // Create response data.
    res.locals.output = {
      file: fileRes.rows[0]
    };
  }
);
