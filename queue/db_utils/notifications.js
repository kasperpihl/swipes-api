import r from 'rethinkdb';
import db from '../db';

const dbInsertMultipleNotifications = ({ notifications }) => {
  const q = r.table('notifications').insert(notifications, {
    returnChanges: true,
  });

  return db.rethinkQuery(q);
};

export default dbInsertMultipleNotifications;
