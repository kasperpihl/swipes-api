import req from 'request';

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

export default request;
