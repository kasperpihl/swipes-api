import r from 'rethinkdb';
import db from '../db';

const dbGetSingleGoal = ({ goal_id }) => {
  const q = r.table('goals').get(goal_id);

  return db.rethinkQuery(q);
};

export default dbGetSingleGoal;
