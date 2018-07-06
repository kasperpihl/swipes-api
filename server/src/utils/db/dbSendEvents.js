import r from 'rethinkdb';
import { object, string, array } from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const eventSchema = object.as({
  type: string.format(/^[a-z0-9\_]*$/gm).require(),
  data: object.require(),
  user_ids: array.min(1).of(string).require(),
});

export default (events) => {
  if(!Array.isArray(events)) {
    events = [events];
  }
  events.forEach((event) => {
    const err = eventSchema.test(event)
    if(err) {
      throw Error(`Invalid event format: ${err}`);
    }
    event.created_at = r.now();
  });

  return dbRunQuery(r.table('events_multiple').insert(events, {
    returnChanges: true,
  }));
}