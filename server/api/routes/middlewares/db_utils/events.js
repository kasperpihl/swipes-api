"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const initActivities = (user_id) => {
  const q =
    r.table('events')
      .filter((e) => {
        return e('user_id').eq(user_id).and(e('type').eq('activity_added'))
      })
      .orderBy(r.desc('date'))
      .without(['id', 'user_id', 'type'])
      .limit(100);

  return db.rethinkQuery(q);
}

const commonMultipleEvents = ({ objToInsert }) => {
  const q = r.table('events_multiple').insert(objToInsert);

  return db.rethinkQuery(q);
}

export {
  initActivities,
  commonMultipleEvents
}
