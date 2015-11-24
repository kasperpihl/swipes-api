"use strict";

const TEAM_ID = process.env.TEAM_ID;

let channels = require('./channels-io.js').channelChanges;
let messages = require('./messages-io.js').channelMessages;
let im = require('./im-io.js');
let stars = require('./stars-io.js');
let apps = require('./apps-io.js');
let common = require('./common-events-io.js');

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log('connected!');
    let userId = socket.request.userId;

    if (!userId) {
      return;
    }

    socket.emit('message', {type: 'hello'});

    channels(socket, userId);
    messages(socket, userId);
    im.channelsIm(socket, userId);
    im.userIm(socket, userId);
    stars.stars(socket, userId);
    apps.hook(socket, userId);
    apps.adminApps(socket, userId);
    common.commonEvents(socket, userId);
  });
};
