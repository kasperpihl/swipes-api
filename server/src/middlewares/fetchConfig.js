import {
  dbConfigGet,
} from 'src/legacy-api/routes/middlewares/db_utils/config';
import {
  valLocals,
} from 'src/legacy-api/utils';

export default (req, res, next) => {
  const config = {};
  dbConfigGet().then((results) => {
    results.forEach(({ id, value }) => {
      config[id] = value;
    })
    res.locals.config = config;

    return next();
  }).catch((err) => {
    return next(err);
  });
};