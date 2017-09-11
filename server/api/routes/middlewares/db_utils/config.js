import r from 'rethinkdb';
import db from '../../../../db';

const dbConfigGet = () => {
  const q = r.table('config');

  return db.rethinkQuery(q);
};

export {
  dbConfigGet,
};
