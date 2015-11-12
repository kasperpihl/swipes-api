/*
  Parse json to rethinkdb query
  On success - returns a rethinkdb expression for the query
  On error - returns {err: error}. Return always on the first error.
*/

"use strict";

let r = require('rethinkdb');

let jsonToQuery = (json) => {
  let rethinkQ;

  let table = json.table;

  if (!table) {
    return {err: 'Table is required!'}
  }

  rethinkQ = r.table(table);

  let data = json.data;

  if (data) {
    // The user wants to perform an insert or update
    let id = json.id;

    if (id) {
      // Single update
      rethinkQ = rethinkQ.get(id).update(data);
    } else {
      rethinkQ = rethinkQ.insert(data);
    }
  } else {
    // The user wants to perform a get
    let id = json.id;

    if (id) {
      // Single get
      rethinkQ = rethinkQ.get(id);
    } else {
      let order = json.order;

      if (order) {
        let desc = order.charAt(0) === '-';

        if (desc) {
          rethinkQ = rethinkQ.orderBy(r.desc(order.substr(1)));
        } else {
          rethinkQ = rethinkQ.orderBy(order);
        }
      }

      let limit = json.limit;

      if (limit) {
        rethinkQ = rethinkQ.limit(limit);
      }
    }
  }

  return rethinkQ;
}

module.exports.jsonToQuery = jsonToQuery;
