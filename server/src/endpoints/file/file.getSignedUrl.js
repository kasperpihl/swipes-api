import { string } from 'valjs';
import aws from 'aws-sdk';
import config from 'config';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const { s3BucketName, s3Url, s3Region } = config.get('aws');

const expectedInput = {
  owned_by: string.require(),
  file_name: string.require(),
  file_type: string.require()
};
const expectedOutput = {
  s3_url: string.require(),
  signed_url: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    expectedOutput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { file_name, owned_by, file_type } = input;

    const seconds = (Date.now() / 1000) | 0;
    const s3Path = `uploads/${owned_by}/${seconds}-${user_id}/${slug(
      file_name
    )}`;

    const s3 = new aws.S3({
      region: s3Region
    });
    const params = {
      Bucket: s3BucketName,
      Key: s3Path,
      Expires: 60,
      ContentType: file_type
    };

    const signed_url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', params, (err, data) => {
        (err && reject(err)) || resolve(data);
      });
    });

    // Create response data.
    res.locals.output = {
      signed_url,
      s3_url: `${s3Url}${s3Path}`
    };
  }
);
