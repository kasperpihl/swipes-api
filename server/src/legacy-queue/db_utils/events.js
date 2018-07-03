import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const commonMultipleEvents = ({ objToInsert }) => {
  const q = r.table('events_multiple').insert(objToInsert);

  return dbRunQuery(q);
};

export default commonMultipleEvents;
