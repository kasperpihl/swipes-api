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

let updateUserWorkflowsQ = (userId, wfId, updateDoc) => {
  let query =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          workflows: user('workflows').map((wf) => {
            return r.branch(
              wf('id').eq(wfId),
              wf.merge(updateDoc),
              wf
            )
          })
        }
      })

  return query;
}

module.exports = {
  appsList: appsList,
  updateUserWorkflowsQ: updateUserWorkflowsQ
};
