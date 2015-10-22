"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');

let channelChanges = (socket) => {
  let insertQ =
    r.table('events')
      .filter({teamId: TEAM_ID})
      .changes()

    db.rethinkQuery(insertQ, {feed: true})
      .then((cursor) => {
        cursor.each((err, row) => {
          if (err) {
            console.log(err);
            // T_TODO how to handle erros here?!
            // Sending error message on the socket?
            return;
          }

          socket.emit('message', row);
        })
      })
 }

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log('connected!');

    socket.emit('message', {type: 'hi'});
    // socket.on('captain', (data) => {
    //   console.log(data);
    //
    // });

    channelChanges(socket);
  });
};
