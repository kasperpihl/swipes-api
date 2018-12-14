import { dbConfigGet } from 'src/_legacy-api/routes/middlewares/db_utils/config';
import { valLocals } from 'src/_legacy-api/utils';

export default (req, res, next) => {
  dbConfigGet()
    .then(results => {
      const config = {};
      results.forEach(({ id, value }) => {
        config[id] = value;
      });
      res.locals.config = config;

      return next();
    })
    .catch(err => {
      return next(err);
    });
};
