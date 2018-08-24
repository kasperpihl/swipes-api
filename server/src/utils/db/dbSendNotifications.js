import r from 'rethinkdb';
import { object, string, array } from 'valjs';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendEvents from 'src/utils/db/dbSendEvents';

const notificationSchema = object.as({
  id: string.require(),
  organization_id: string.require(),
  user_id: string.require(),
  target: object.as({
    id: string.require(),
    item_id: string,
  }).require(),
  title: string.require(),
  done_by: array.of(string),
});

export default async (notifications) => {
  if(!Array.isArray(notifications)) {
    notifications = [notifications];
  }
  if(!notifications.length) {
    return;
  }
  notifications.forEach((notification) => {
    const err = notificationSchema.test(notification)
    if(err) {
      throw Error(`Invalid notification format: ${err}`);
    }
    notification.seen_at = null;
    notification.created_at = r.now();
  });
  
  const q = dbInsertQuery('notifications', notifications, {
    conflict: 'update',
  });
  const result = await dbRunQuery(q);

  const events = result.changes.map(({ new_val }) => ({
    user_ids: [ new_val.user_id ],
    type: 'notification_added',
    data: { notification: new_val },
  }));

  await dbSendEvents(events);
}