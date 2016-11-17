"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const initActivities = (userId) => {
  const q =
    r.table('events')
      .filter((e) => {
        return e('user_id').eq(userId).and(e('type').eq('activity_added'))
      })
      .orderBy(r.desc('date'))
      .without(['id', 'user_id', 'type'])
      .limit(100);

  return db.rethinkQuery(q);
}

export {
  initActivities
}
