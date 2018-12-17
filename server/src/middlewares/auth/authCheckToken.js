import { dbCheckToken } from 'src/_legacy-api/routes/middlewares/db_utils/tokens';

export default (req, res, next) => {
  const { user_id, dbToken } = res.locals;

  dbCheckToken({ user_id, token: dbToken })
    .then(results => {
      if (results.length === 0) {
        throw Error('not_authed');
      }

      return next();
    })
    .catch(e => {
      throw Error('database_error');
    });
};
