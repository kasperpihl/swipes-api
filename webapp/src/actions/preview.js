import * as types from 'constants';
import * as a from 'actions';

export const preview = pre => (d) => {
  let endpoint = 'links.preview';
  let params = {
    short_url: pre,
  };
  if (typeof pre === 'object') {
    endpoint = 'find.preview';
    params = pre;
  }
  d({ type: types.PREVIEW_LOADING });
  d(a.api.request(endpoint, params)).then((res) => {
    console.log(res);
  });
};
