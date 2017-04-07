import * as a from './';
import { randomString } from '../classes/utils';

export const upload = (targetId, files) => (dispatch, getState) => new Promise((resolve) => {
  // First do S3 upload
  const file = files[0];
  const fileName = file.name;
  const orgId = getState().getIn(['me', 'organizations', 0, 'id']);
  const s3FileName = randomString(32);
  dispatch(a.api.request('files.signedUrl', {
    file_name: `uploads/${orgId}/${s3FileName}`,
    file_type: file.type,
  })).then((res) => {
    const signedUrl = res.signed_url;

    return fetch(signedUrl, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
  }).then((res) => {
      // Attach the file to the goal
      dispatch(a.api.request('files.upload', {
        target_id: targetId,
        organization_id: orgId,
        file_name: fileName,
        s3_name: s3FileName,
      }))
      .then((res) => {
        resolve(res);
      })
  });
});
