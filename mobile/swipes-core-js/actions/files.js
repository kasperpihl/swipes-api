import * as a from './';

export const upload = files => (dispatch, getState) => new Promise((resolve) => {
    // First do S3 upload
  console.log('files', files);
  dispatch(a.api.request('files.upload', {
      // body...
  })).then(res => resolve(res));
});
