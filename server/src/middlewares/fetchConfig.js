import { query } from 'src/utils/db/db';

export default async (req, res, next) => {
  const configRes = await query('SELECT * FROM config');
  res.locals.config = {};
  configRes.rows.forEach(row => {
    res.locals.config[row.config_id] = row.value;
  });
  return next();
};
