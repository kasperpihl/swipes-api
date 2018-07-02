import {
  parseToken,
} from '../api/utils';
import {
  dbCheckToken,
} from '../api/routes/middlewares/db_utils/tokens';

const authParseToken = (req, res, next) => {
  const {
    token,
  } = res.locals;

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
const authCheckToken = (req, res, next) => {
  const {
    user_id,
    dbToken,
  } = res.locals;

  dbCheckToken({ user_id, token: dbToken })
    .then((results) => {
      if (results.length === 0) {
        return res.status(200).json({ ok: false, error: 'not_authed' });
      }

      return next();
    })
    .catch((e) => {
      return res.status(200).json({ ok: false, error: 'database_error' });
    });
};

export {
  authParseToken,
  authCheckToken,
};