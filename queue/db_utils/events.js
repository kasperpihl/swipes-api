import r from 'rethinkdb';
import db from '../db';

const commonMultipleEvents = ({ objToInsert }) => {
  const q = r.table('events_multiple').insert(objToInsert);

  return db.rethinkQuery(q);
};

export default commonMultipleEvents;
