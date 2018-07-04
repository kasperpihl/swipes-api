import { dbCheckToken } from 'src/_legacy-api/routes/middlewares/db_utils/tokens';

export default (req, res, next) => {
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
