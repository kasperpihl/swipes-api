"use strict";

let r = require('rethinkdb');

/*
  Common Apps Queries
*/
let appsList = (isAdmin) => {
  let listQ = r.table('apps');

  if (isAdmin) {
    listQ = listQ.filter((app) =>{
      return app.hasFields('deleted').not()
    });
  } else {
    listQ = listQ.filter({is_installed: true});
  }

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
