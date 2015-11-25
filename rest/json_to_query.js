/*
  Parse json to rethinkdb query
  On success - returns a rethinkdb expression for the query
  On error - returns {err: error}. Return always on the first error.
*/

"use strict";

let r = require('rethinkdb');

let jsonToQuery = (json, options) => {
  options = options ? options : {};

  let feed = options.feed;
  let rethinkQ;

  let table = json.table;

  if (!table) {
    return {err: 'Table is required!'}
  }

  rethinkQ = r.table(table);

  let data = json.data;

  if (data) {
    // The user wants to perform an insert or update
    rethinkQ = rethinkQ.insert(data, {conflict: "update"});
  } else {
    // The user wants to perform a get
    let id = json.id;

    if (id) {
      // Single get
      rethinkQ = rethinkQ.get(id);
    } else {
      let query = json.query;
      let filter = query && query.filter;
      let order = query && query.order;
      let limit = query && query.limit;

      if (filter) {
        rethinkQ = rethinkQ.filter(filter);
      }

      if (order) {
        let desc = order.charAt(0) === '-';
        let orderBy;

        if (feed) {
          orderBy = desc ? {index: r.desc(order.substr(1))} : {index: order};
        } else {
          orderBy = desc ? r.desc(order.substr(1)) : order;
        }

        rethinkQ = rethinkQ.orderBy(orderBy);
      }

      if (limit) {
        rethinkQ = rethinkQ.limit(limit);
      }
    }
  }

  return rethinkQ;
}

module.exports.jsonToQuery = jsonToQuery;
