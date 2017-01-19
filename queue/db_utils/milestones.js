import r from 'rethinkdb';
import db from '../db';

const dbGetSingleMilestone = ({ milestone_id }) => {
  const q = r.table('milestones').get(milestone_id);

  return db.rethinkQuery(q);
};

export default dbGetSingleMilestone;
