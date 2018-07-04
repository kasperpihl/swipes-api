import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbGetSingleMilestone = ({ milestone_id }) => {
  const q = r.table('milestones').get(milestone_id);

  return dbRunQuery(q);
};

export default dbGetSingleMilestone;
