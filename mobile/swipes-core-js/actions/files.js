import * as a from './';

export const upload = files => (dispatch, getState) => new Promise((resolve) => {
    // First do S3 upload
  console.log('files', files);
  const file = files[0];
  dispatch(a.api.request('files.signedUrl', {
    file_name: file.name,
    file_type: file.type,
  })).then(res => {
    const signedUrl = res.signed_url;

    return fetch(signedUrl, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    })
  }).then(res => {
      console.log(res);
      resolve(res);
  });
});
