import { parseToken } from 'src/_legacy-api/utils';

export default (req, res, next) => {
  const { token } = res.locals;

  if (token) {
    const parsedToken = parseToken(token);

    if (!parsedToken) {
      return res.status(200).json({ ok: false, error: 'not_authed' });
    }

    res.locals.user_id = parsedToken.content.iss;
    res.locals.constructedToken = parsedToken.constructedToken;
    res.locals.dbToken = parsedToken.dbToken;

    return next();
  }

  return res.status(200).json({ ok: false, error: 'not_authed' });
};