import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbGetSingleWay = ({ way_id }) => {
  const q = r.table('ways').get(way_id);

  return dbRunQuery(q);
};

export default dbGetSingleWay;
