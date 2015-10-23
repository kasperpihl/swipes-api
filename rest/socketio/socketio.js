"use strict";

const TEAM_ID = process.env.TEAM_ID;

let channels = require('./channels-io.js').channelChanges;

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log('connected!');

    socket.emit('message', {type: 'hi'});

    channels(socket);
  });
};
