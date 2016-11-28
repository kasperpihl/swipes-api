"use strict";

let r = require('rethinkdb');
let Promise = require('bluebird');
let _ = require('underscore');
let db = require('../db');

let types = {
  added: 'service_added',
  removed: 'service_removed',
  changed: 'service_changed'
};

let getType = (o, n) => {
  let oL = o ? o.length : 0;
  let nL = n ? n.length : 0;
  let type = 'service_';

  if (nL > oL) {
    return types.added;
  }
  if (oL > nL) {
    return types.removed;
  }

  return types.changed;
}

let difference = (o, n, type) => {
  let left = n;
  let right = o;
  let result = [];

  if (type === types.removed) {
    left = o;
    right = n;
  }

  if (type === types.changed) {
    _.each(right, (item) => {
      let filteredItems = _.filter(left, (leftItem) => {
        if (item.id === leftItem.id) {
          return !_.isEqual(item, leftItem);
        } else {
          return false;
        }
      });

      result.push(filteredItems);
    });

    return _.flatten(result, true);
  } else {
    return _.filter(left, (item) => {
      return !_.findWhere(right, {id: item.id});
    })
  }
}

let userServices = (socket, userId) => {
  let listenQ =
    r.table("users")
      .filter((user) => {
        return user('id').eq(userId)
      })('services')
      .changes();

  db.rethinkQuery(listenQ, {feed: true, socket: socket})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        let o = row.old_val;
        let n = row.new_val;
        let type = getType(o, n);
        let payload = difference(o, n, type);

        // omit some fields
        payload = payload.map((service) => {
          return _.omit(service, ['auth_data', 'cursors']);
        })

        // In an event when we delete multiple workflows we will return array here
        // In any other case we will return object
        if (payload.length === 1) {
          payload = payload[0];
        }

        socket.send(JSON.stringify({ type, payload }));
      });
    })
};

export {
  userServices
}
