import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbGetSingleGoal = ({ goal_id }) => {
  const q = r.table('goals').get(goal_id);

  return dbRunQuery(q);
};

export default dbGetSingleGoal;
