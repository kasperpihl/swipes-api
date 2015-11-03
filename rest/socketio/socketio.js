"use strict";

const TEAM_ID = process.env.TEAM_ID;

let channels = require('./channels-io.js').channelChanges;
let messages = require('./messages-io.js').channelMessages;
let im = require('./im-io.js').imChanges;

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log('connected!');
    let userId = socket.request.session.userId;

    if (!userId) {
      return;
    }

    socket.emit('hello', {type: 'hello'});

    channels(socket, userId);
    messages(socket, userId);
    im(socket, userId);
  });
};
