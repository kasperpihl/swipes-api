import r from 'rethinkdb';
import db from '../../../../db';

const dbGoalsInsertSingle = ({ goal }) => {
  const q = r.table('goals').insert(goal);

  return db.rethinkQuery(q);
};
const dbGoalsUpdateSingle = ({ goal_id, properties }) => {
  const q = r.table('goals').get(goal_id).update(properties);

  return db.rethinkQuery(q);
};
const dbGoalsGetSingle = ({ goal_id }) => {
  const q = r.table('goals').get(goal_id);

  return db.rethinkQuery(q);
};

export {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
};
