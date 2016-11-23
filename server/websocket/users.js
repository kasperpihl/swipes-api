"use strict";

import r from 'rethinkdb';
import db from '../db';

const usersProfilePic = (socket, userId) => {
  const q =
    r.db('swipes')
      .table('users')
      .getAll(userId)
      .map((user) => {
        return user('profile_pic')
      })
      .changes()

  db.rethinkQuery(q, {feed: true, socket: socket})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        const type = 'profile_pic_updated';
        const payload = row.new_val;

        socket.send(JSON.stringify({ type, payload }));
      })
    })
    .catch((err) => {
      console.log(err);
    })
}

export {
  usersProfilePic
}
