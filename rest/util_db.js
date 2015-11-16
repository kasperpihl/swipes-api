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

let updateUserAppQ = (userId, appId, updateObj) => {
  let query =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          apps: user('apps').map((app) => {
            return r.branch(
              app('id').eq(appId),
              app.merge(updateObj),
              app
            )
          })
        }
      })

  return query;
}

module.exports = {
  appsList: appsList,
  updateUserAppQ: updateUserAppQ
};
