import randomstring from 'randomstring';

export default function logGetObject(req, res) {
  const localsCopy = Object.assign({}, res.locals);
  delete localsCopy.config;

  if (localsCopy.password) {
    localsCopy.password = '___PROTECTED___';
  }

  if (localsCopy.token) {
    localsCopy.token = '___PROTECTED___';
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const logId = randomstring.generate(50);

  return {
    ip,
    request_id: logId,
    user_id: res.locals.user_id,
    headers: req.headers,
    endpoint: req.originalUrl,
    locals: localsCopy
  };
}
