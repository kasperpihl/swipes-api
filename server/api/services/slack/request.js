import req from 'request';
import contentDisposition from 'content-disposition';

const request = ({ auth_data, method, params = {} }, callback) => {
  const copyParams = Object.assign({}, params);

  if (auth_data.access_token) {
    copyParams.token = auth_data.access_token;
  }

  const options = {
    method: 'post',
    form: copyParams,
    json: true,
    url: `https://slack.com/api/${method.toLowerCase()}`,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  req(options, (err, res, body) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    return callback(null, body);
  });
};
const requestStream = ({ auth_data, urlData, user }, res, next) => {
  const options = {
    url: `${urlData.metadata.url_private}`,
    headers: {
      Authorization: `Bearer ${auth_data.access_token}`,
    },
  };

  return req(options)
  .on('response', (response) => {
    response.headers['access-control-allow-origin'] = '*';
    response.headers['cache-control'] = 'no-cache';
    response.headers['Content-Type'] = urlData.metadata.mimetype;
    response.headers['Content-Disposition'] = contentDisposition(urlData.metadata.name);
  })
  .on('end', () => {
    res.end();
  })
  .on('error', () => {
    res.end();
  })
  .pipe(res);
};

export {
  request,
  requestStream,
};
