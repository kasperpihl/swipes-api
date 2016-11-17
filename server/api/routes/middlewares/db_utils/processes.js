"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const processesGetAllOrderedByTitle = (userId) => {
  const q = r.table('processes').orderBy('title');

  return db.rethinkQuery(q);
}

export {
  processesGetAllOrderedByTitle
}
