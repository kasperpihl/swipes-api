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
      res.status(200).json({ok: true, message: doc});
    }).catch((err) => {
      return next(err);
    });
}

let isOpen = (userId, channelId) => {
  return new Promise((resolve, reject) => {
    let channelQ = r.table('users')
      .get(userId)('channels')
      .filter((channel) => {
        return channel('id').eq(channelId)
      })

    db.rethinkQuery(channelQ)
      .then((channels) => {
        return resolve(channels[0].is_open);
      })
      .catch((err) => {
        return reject(err);
      })
  });
}

let openImChannel = (userId, channelId) => {
  return new Promise((resolve, reject) => {
    let getChannelQ = r.table('channels').get(channelId)
    let targetUserId;

    db.rethinkQuery(getChannelQ)
      .then((channel) => {
        // T_TODO check if there is a valid channel?!?
        channel.user_ids.forEach((id) => {
          if (id !== userId) {
            targetUserId = id;
          }
        })

        isOpen(targetUserId, channelId)
          .then((openStatus) => {
            if (openStatus) {
              return resolve();
            } else {
              let imOpenEvent = {
                type: 'im_open',
                user_id: targetUserId,
                target_user_id: userId,
                channel_id: channelId
              }

              let openChannelQ =
                r.table('users')
                  .get(targetUserId)
                  .update((user) => {
                    return {
                      channels: user('channels').map((channel) => {
                        return r.branch(
                          channel('id').eq(channelId),
                          channel.merge({'is_open': true}),
                          channel
                        )
                      })
                    }
                  })

                let imOpenEventQ = r.table('events').insert(imOpenEvent);

                db.rethinkQuery(openChannelQ)
                  .then(() => {
                    db.rethinkQuery(imOpenEventQ)
                      .then(() => {
                        return resolve(true);
                      }).catch((err) => {
                        return reject(err);
                      })
                  })
                  .catch((err) => {
                    return reject(err);
                  })
            }
          }).catch((err) => {
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
  let userId = req.userId;
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

  if (channelId.charAt(0) === 'D') {
    openImChannel(userId, channelId)
      .then(() => {
        insertMessage(res, next, doc);
      })
  } else {
    insertMessage(res, next, doc);
  }
});

module.exports = router;
