import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendEvents from 'src/utils/db/dbSendEvents';

export default async (notificationIds) => {
  if(!Array.isArray(notificationIds)) {
    notificationIds = [notificationIds];
  }

  const q = r.table('notifications').getAll(...notificationIds).delete({
    return_changes: true,
  });

  const res = await dbRunQuery(q);

  dbSendEvents(res.changes.map(({ old_val }) => ({
    user_ids: [ old_val.user_id ],
    type: 'notification_deleted',
    data: {
      notification_id: old_val.id,
    }
  })))
}