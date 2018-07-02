import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbConfigGet = () => {
  const q = r.table('config');

  return dbRunQuery(q);
};

export {
  dbConfigGet,
};
