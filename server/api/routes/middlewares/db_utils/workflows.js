"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const initWorkflows = (userId) => {
  const q =
    r.table('users')
      .get(userId)('workflows').default([])
      .eqJoin('parent_id', r.table('workflows'))
      .without({right: ['id', 'name']}) // No id, nor name from the original service.
      .zip();

  return db.rethinkQuery(q);
}



export {
  initWorkflows
}
