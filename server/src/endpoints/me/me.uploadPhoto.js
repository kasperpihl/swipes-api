import multer from 'multer';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import config from 'config';
import fs from 'fs';
import mime from 'mime-types';
import update from 'src/utils/update';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import sqlJsonbBuild from 'src/utils/sql/sqlJsonbBuild';

const expectedInput = {};

const { s3BucketName, s3Url, s3Region } = config.get('aws');

const upload = (req, res) =>
  new Promise((resolve, reject) =>
    multer({ dest: '/tmp/' }).single('photo')(
      req,
      res,
      e => (e && reject(e)) || resolve()
    )
  );
const resizePhoto = ({ size, path }) =>
  sharp(path)
    .resize(size, size)
    .toBuffer();

export default endpointCreate(
  {
    expectedInput,
    method: 'post'
  },
  async (req, res) => {
    // Get inputs

    const { user_id } = res.locals;

    await upload(req, res);

    const file = req.file;

    const resizePromises = [
      resizePhoto({ size: 192, path: file.path }),
      resizePhoto({ size: 96, path: file.path }),
      resizePhoto({ size: 64, path: file.path })
    ];

    let resizedImages = await Promise.all(resizePromises);
    resizedImages = [fs.createReadStream(file.path)].concat(resizedImages);

    const s3 = new AWS.S3({
      region: s3Region
    });

    const seconds = (Date.now() / 1000) | 0;
    const s3Path = `profile_photos/${seconds}-${user_id}/`;
    const mimeType = file.mimetype;
    const fileExt = mime.extension(mimeType);

    const uploadPromises = ['original', '192x192', '96x96', '64x64'].map(
      (size, i) => {
        return s3
          .putObject({
            Bucket: s3BucketName,
            ContentType: mimeType,
            Key: `${s3Path}${size}.${fileExt}`,
            Body: resizedImages[i]
          })
          .promise();
      }
    );

    await Promise.all(uploadPromises);

    const photo = {
      original: `${s3Url}${s3Path}original.${fileExt}`,
      '192x192': `${s3Url}${s3Path}192x192.${fileExt}`,
      '96x96': `${s3Url}${s3Path}96x96.${fileExt}`,
      '64x64': `${s3Url}${s3Path}64x64.${fileExt}`
    };

    const userRes = await query(
      `
        UPDATE users
        SET
          photo = ${sqlJsonbBuild(photo)},
          updated_at = now()
        WHERE user_id = $1
        RETURNING photo, user_id
      `,
      [user_id]
    );

    const teamRes = await query(
      `
        SELECT team_id
        FROM team_users
        WHERE user_id = $1
        AND status = 'active'
      `,
      [user_id]
    );

    const channels = [user_id, ...teamRes.rows.map(r => r.team_id)];

    res.locals.update = update.prepare(channels, [
      { type: 'me', data: userRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
});
