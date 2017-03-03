import r from 'rethinkdb';
import _ from 'underscore';
import db from '../db';

const types = {
  added: 'service_added',
  removed: 'service_removed',
  changed: 'service_changed',
};
const getType = (o, n) => {
  const oL = o ? o.length : 0;
  const nL = n ? n.length : 0;

  if (nL > oL) {
    return types.added;
  }
  if (oL > nL) {
    return types.removed;
  }

  return types.changed;
};
const difference = (o, n, type) => {
  let left = n;
  let right = o;
  const result = [];

  if (type === types.removed) {
    left = o;
    right = n;
  }

  if (type === types.changed) {
    _.each(right, (item) => {
      const filteredItems = _.filter(left, (leftItem) => {
        if (item.id === leftItem.id) {
          return !_.isEqual(item, leftItem);
        }

        return false;
      });

      result.push(filteredItems);
    });

    return _.flatten(result, true);
  }

  return _.filter(left, (item) => {
    return !_.findWhere(right, { id: item.id });
  });
};
const userServices = (socket, userId) => {
  const listenQ =
    r.table('users')
      .filter((user) => {
        return user('id').eq(userId);
      })('services')
      .changes();

  db.rethinkQuery(listenQ, { feed: true, socket })
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        const o = row.old_val;
        const n = row.new_val;
        const type = getType(o, n);
        let payload = difference(o, n, type);

        // omit some fields
        payload = payload.map((service) => {
          return _.omit(service, ['auth_data', 'cursors']);
        });

        // In an event when we delete multiple workflows we will return array here
        // In any other case we will return object
        if (payload.length === 1) {
          payload = payload[0];
        }

        socket.send(JSON.stringify({ type, payload: { data: payload } }));
      });
    });
};

export default userServices;
