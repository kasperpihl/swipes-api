import { parseToken } from 'src/_legacy-api/utils';

export default (req, res, next) => {
  const { token } = res.locals;

  if (!token) {
    throw Error('not_authed');
  }
  const parsedToken = parseToken(token);

  if (!parsedToken) {
    throw Error('not_authed');
  }

  res.locals.user_id = parsedToken.content.iss;
  res.locals.constructedToken = parsedToken.constructedToken;
  res.locals.dbToken = parsedToken.dbToken;

  return next();
};
