import r from 'rethinkdb';
import db from '../db';

const dbGetSingleWay = ({ way_id }) => {
  const q = r.table('ways').get(way_id);

  return db.rethinkQuery(q);
};

export default dbGetSingleWay;
