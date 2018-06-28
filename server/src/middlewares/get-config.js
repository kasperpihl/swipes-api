import {
  dbConfigGet,
} from '../api/routes/middlewares/db_utils/config';
import {
  valLocals,
} from '../api/utils';

const getConfig = valLocals('getConfig', {}, (req, res, next, setLocals) => {
  const config = {};
  dbConfigGet().then((results) => {
    results.forEach(({ id, value }) => {
      config[id] = value;
    })
    setLocals({
      config,
    });

    return next();
  }).catch((err) => {
    return next(err);
  });
});

export default getConfig;
