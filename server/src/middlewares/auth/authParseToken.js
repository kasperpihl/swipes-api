import parseToken from 'src/utils/auth/parseToken';

export default (req, res, next) => {
  const { token } = res.locals;

  if (!token) {
    throw Error('not_authed');
  }
  const parsedToken = parseToken(token);

  console.log('parsedToken', parsedToken);
  if (!parsedToken) {
    throw Error('not_authed');
  }

  res.locals.user_id = parsedToken.tokenContent.iss;
  res.locals.token = parsedToken.token;

  return next();
};
