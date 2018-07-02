import {
  dbConfigGet,
} from '../api/routes/middlewares/db_utils/config';
import {
  valLocals,
} from '../api/utils';

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

export default getConfig;
