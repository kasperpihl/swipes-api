import r from 'rethinkdb';
import db from '../../../../db';

const dbMilestonesInsertSingle = ({ milestone }) => {
  const q = r.table('milestones').insert(milestone);

  return db.rethinkQuery(q);
};

const dbMilestonesUpdateSingle = ({ id, properties }) => {
  const q = r.table('milestones').get(id).update(properties);

  return db.rethinkQuery(q);
};

export {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
};
