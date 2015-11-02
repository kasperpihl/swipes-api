"use strict";

const TEAM_ID = process.env.TEAM_ID;

let express = require( 'express' );
let Promise = require('bluebird');
let getSlug = require('speakingurl');
let r = require('rethinkdb');
let moment = require('moment');
let validator = require('validator');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;
let generateSlackLikeTs = util.generateSlackLikeTs;

let router = express.Router();

let insertMessage = (res, next, doc) => {
  let query = r.table('messages').insert(doc);

  db.rethinkQuery(query)
    .then((results) => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
}

let createChannel = (creatorId, receiverId) => {
  // T_TODO check if there is a DM channel already with these users
  return new Promise((resolve, reject) => {
    let doc = {
      id: generateId('D'),
      created: moment().unix(),
      teamId: TEAM_ID,
      creator_id: creatorId
    };

    let createDMChannelQ =
      r.table('channels')
        .insert(doc, {returnChanges: true});

    db.rethinkQuery(createDMChannelQ)
      .then((inserted) => {
        let newChannelId = inserted.changes[0].new_val.id;
        let channelToAppend = {
          id: newChannelId
        };
        let updateQ =
          r.table('users')
            .getAll(creatorId, receiverId)
            .update({
              channels: r.row('channels').append(channelToAppend)
            })

        db.rethinkQuery(updateQ)
          .then(() => {
            return resolve(newChannelId);
          })
          .catch((err) => {
            return reject(err);
          })
      }).catch((err) => {
        return reject(err);
      });
  });
}

router.post('/chat.send', (req, res, next) => {
  // T_TODO check if there is a channel with that id
  let channelId = req.body.channel_id;
  let userId = req.session.userId;
  let text = req.body.text;

  if (validator.isNull(channelId)) {
    return res.status(409).json({err: 'The channel id cannot be empty!'});
  }

  if (validator.isNull(text)) {
    return res.status(409).json({err: 'You can\'t send an empty message!'});
  }

  let ts = generateSlackLikeTs();
  let doc = {
    channel_id: channelId,
    user_id: userId,
    text: text,
    ts: ts
  };

  if (channelId.indexOf('U') === 0) {
    createChannel(userId, channelId).then ((newChannelId) => {
      doc.channel_id = newChannelId;

      insertMessage(res, next, doc);
    })
  } else {
    insertMessage(res, next, doc);
  }
});

module.exports = router;
