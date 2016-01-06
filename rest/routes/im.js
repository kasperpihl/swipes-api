"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let moment = require('moment');
let validator = require('validator');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;

let router = express.Router();

let imListQ = (userId) => {
  return r.table('users')
          .get(userId)('channels')
          .filter((channel) => {
            return channel('id').match('^D')
          })
}

let toArrayOfIds = (query) => {
  return query.map((im) => {
    return im('id')
  })
}

let createChannel = (creatorId, receiverId) => {
  return new Promise((resolve, reject) => {
    let doc = {
      id: generateId('D'),
      created: moment().unix(),
      creator_id: creatorId,
      user_ids: [creatorId, receiverId],
      type: 'direct'
    };

    let createDMChannelQ =
      r.table('channels').insert(doc);

    db.rethinkQuery(createDMChannelQ)
      .then(() => {
        let newChannelId = doc.id;

        let creatorChannel = {
          id: newChannelId,
          user_id: creatorId
        };
        let receiverChannel = {
          id: newChannelId,
          user_id: receiverId
        };

        let updateCreatorQ =
          r.table('users')
            .get(creatorId)
            .update((user) => {
              return {
                channels: user('channels').append(receiverChannel)
              }
            });
        let updateReceiverQ =
          r.table('users')
            .get(receiverId)
            .update((user) => {
              return {
                channels: user('channels').append(creatorChannel)
              }
            });

        db.rethinkQuery(r.do(updateCreatorQ, updateReceiverQ))
          .then(() => {
            return resolve(doc);
          })
          .catch((err) => {
            return reject(err);
          })
      }).catch((err) => {
        return reject(err);
      });
  });
}

let openChannel = (userId, targetUserId, channelId) => {
  let imOpenEvent = {
    type: 'im_open',
    user_id: userId,
    target_user_id: targetUserId,
    channel_id: channelId
  }

  return new Promise((resolve, reject) => {
    let updateQ =
      r.table('users')
        .get(userId)
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

    db.rethinkQuery(updateQ)
      .then(() => {
        db.rethinkQuery(imOpenEventQ)

        return resolve(true);
      })
      .catch((err) => {
        return reject(err);
      })
  })
}

// T_TODO check if it's open before update (mainly for optimization)
// let isOpen = (userId, channelId) => {
//   return new Promise((resolve, reject) => {
//     channelQ = r.table('users')
//       .get(userId)('channels')
//       .filter((channel) => {
//         return channel('id').eq(channelId)
//       })
//
//     db.rethinkQuery(channelQ)
//       .then((channel) => {
//         return resolve(channel.is_open);
//       })
//       .catch((err) => {
//         return reject(err);
//       })
//   });
// }

router.post('/im.list', (req, res, next) => {
  let userId = req.userId;

  let listQ = imListQ(userId);

  db.rethinkQuery(listQ)
    .then((results) => {
        return res.status(200).json({ok: true, channels: results});
    }).catch((err) => {
      return next(err);
    });
})

router.post('/im.open', (req, res, next) => {
  // T_TODO validate input data
  let userId = req.userId;
  let targetUserId = req.body.user_id;

  let userImListQ = toArrayOfIds(imListQ(userId));
  let targetImListQ = toArrayOfIds(imListQ(targetUserId));

  let checkQ = r.do(
    userImListQ,
    targetImListQ,
    (imList, targetImList) => {
      return imList.filter((imId) => {
        return targetImList.contains(imId)
      })
    }
  )

  db.rethinkQuery(checkQ)
    .then((ims) => {
        let imsLen = ims.length

        if (imsLen === 0) {
          createChannel(userId, targetUserId).then((newChannel) => {
            openChannel(userId, targetUserId, newChannel.id)
              .then(() => {
                return res.status(200).json({ok: true, channel: newChannel});
              })
              .catch((err) => {
                return next(err);
              });
          }).catch((err) => {
            return next(err);
          });
        } else {
          let channelId = ims[0];
          let getChannelQ = r.table('channels').get(channelId);

          openChannel(userId, targetUserId, channelId)
            .then(() => {
              db.rethinkQuery(getChannelQ)
                .then((channel) => {
                  return res.status(200).json({ok: true, channel: channel});
                })
                .catch((err) => {
                  return next(err);
                })
            })
            .catch((err) => {
              return next(err);
            });
        }
    }).catch((err) => {
      return next(err);
    });
})

module.exports = router;
