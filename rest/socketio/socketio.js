"use strict";

const TEAM_ID = process.env.TEAM_ID;

let channels = require('./channels-io.js').channelChanges;
let messages = require('./messages-io.js').channelMessages;

module.exports = (io, userId) => {
  io.sockets.on('connection', (socket) => {
    console.log('connected!');

    socket.emit('hello', {type: 'hello'});

    channels(socket);
    messages(socket, userId);
  });
};
