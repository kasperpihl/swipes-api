import * as a from './';

const sendFile = (presignedURL, file, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(file.uri);
      } else {
        callback(null, file.uri);
      }
    }
  };
  xhr.open('PUT', presignedURL);
  xhr.setRequestHeader('Content-Type', file.type);
  xhr.send(file);
};

export const upload = (targetId, files, body) => (dispatch, getState) => new Promise((resolve) => {
  // First do S3 upload
  const file = files[0];
  const fileName = file.name;
  const orgId = getState().getIn(['me', 'organizations', 0, 'id']);
  let s3Url = '';
  dispatch(a.api.request('files.signedUrl', {
    organization_id: orgId,
    file_name: fileName,
    file_type: file.type,
  })).then((res) => {
    const signedUrl = res.signed_url;
    s3Url = res.s3_url;

    sendFile(signedUrl, file, (successURI) => {
      if(successURI) {
        console.log('dispatch!', successURI);
        dispatch(a.api.request('files.upload', {
          target_id: targetId,
          organization_id: orgId,
          file_name: fileName,
          s3_url: s3Url,
        }))
        .then((res) => {
          resolve(res);
        })
      }

    });
  }).catch((e) => {
    console.log('error', e);
  });
});
