import r from 'rethinkdb';
import db from '../../../../db';

const dbWaysInsertSingle = ({ way }) => {
  const q = r.table('ways').insert(way);

  return db.rethinkQuery(q);
};

const dbWaysUpdateSingle = ({ id, properties }) => {
  const q = r.table('ways').get(id).update(properties);

  return db.rethinkQuery(q);
};

export {
  dbWaysInsertSingle,
  dbWaysUpdateSingle,
};
