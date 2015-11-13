"use strict";

let r = require('rethinkdb');

/*
  Common Apps Queries
*/
let appsList = (isAdmin) => {
  let filter = isAdmin ? {} : {is_active: true};
  let listQ = r.table('apps').filter(filter);

  return listQ;
}

module.exports = {
  appsList: appsList
};
