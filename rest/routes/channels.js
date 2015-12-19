"use strict";

const TEAM_ID = process.env.TEAM_ID;

let express = require( 'express' );
let getSlug = require('speakingurl');
let r = require('rethinkdb');
let moment = require('moment');
let validator = require('validator');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;

let router = express.Router();

router.post('/channels.list', (req, res, next) => {
  let query = r.table('channels');

  db.rethinkQuery(query)
    .then((results) => {
        res.status(200).json({ok: true, results: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.mark', (req, res, next) => {
  // T_TODO validation
  let userId = req.userId;
  let channelId = req.body.channel_id;
  let ts = req.body.ts;

  let updateQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          channels: user('channels').map((channel) => {
            return r.branch(
              channel('id').eq(channelId),
              channel.merge({last_read: ts}),
              channel
            )
          })
        }
      })

  let eventQ =
    r.table('events')
      .insert({
        type: 'channel_marked',
        user_id: userId,
        channel_id: channelId,
        ts: ts
      })

  db.rethinkQuery(r.do(updateQ, eventQ))
    .then(() => {
        res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.history', (req, res, next) => {
  // T_TODO check if that user is part of the channel
  // and ofc some validation for the required params
  let channel_id = req.body.channel_id;
  let count = req.body.count || 50;

  let query =
    r.table('messages')
      .filter({channel_id: channel_id})
      .limit(count)
      .orderBy(r.desc('ts'));

  db.rethinkQuery(query)
    .then((results) => {
        res.status(200).json({ok: true, messages: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.create', (req, res, next) => {
  let doc = {};
  let userId = req.userId;
  let name = getSlug(validator.trim(req.body.name));

  if (validator.isNull(name)) {
    return res.status(409).json({err: 'The name cannot be empty!'});
  }

  doc.id = generateId('C');
  doc.name = name;
  doc.is_archived = false;
  doc.created = moment().unix();
  doc.teamId = TEAM_ID;
  doc.creator_id = userId;

  let query = r.branch(
          r.table('channels').getAll(doc.name, {index: 'name'}).isEmpty(),
          r.table('channels').insert(doc),
          {}
        );

  db.rethinkQuery(query)
    .then((results) => {
      if (util.isEmpty(results)) {
        res.status(409).json({err: 'There is a channel with that name.'});
      } else {
        res.status(200).json({ok: true});
      }
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.rename', (req, res, next) => {
  let id = req.body.channel_id;
  let name = getSlug(validator.trim(req.body.name));

  if (validator.isNull(id)) {
    return res.status(409).json({err: 'Id is required!'});
  }

  if (validator.isNull(name)) {
    return res.status(409).json({err: 'The name cannot be empty!'});
  }

  let query = r.table('channels').get(id).update({name: name});

  db.rethinkQuery(query)
    .then((results) => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.archive', (req, res, next) => {
  let id = req.body.channel_id;
  let query = r.table('channels').get(id).update({is_archived: true});

  db.rethinkQuery(query)
    .then((results) => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.unarchive', (req, res, next) => {
  let id = req.body.channel_id;
  let query = r.table('channels').get(id).update({is_archived: false});

  db.rethinkQuery(query)
    .then((results) => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.delete', (req, res, next) => {
  let id = req.body.channel_id;
  let query = r.table('channels').get(id).update({deleted: true});

  db.rethinkQuery(query)
    .then((results) => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/channels.join', (req, res, next) => {
  let userId = req.userId;
  let channelName = req.body.channel_name;
  let getChannelQ =
    r.table('channels')
      .getAll(channelName, {index: 'name'})
      .nth(0)
      .default(null);

  db.rethinkQuery(getChannelQ)
    .then((channel) => {
      if (channel === null) {
        return res.status(200).json({ok: false, err: 'channel_does_not_exist'});
      }

      let checkJoinedQ =
        r.table('users')
          .get(userId)('channels')
          .filter({id: channel.id});

      db.rethinkQuery(checkJoinedQ)
        .then((joined) => {
          if (joined.length > 0) {
            return res.status(200).json({ok: false, err: 'already_joined'});
          }

          let lastTsInChannelQ =
            r.table('messages')
              .getAll(channel.id, {index: 'channel_id'})
              .orderBy(r.desc('ts'))
              .nth(0)('ts')
              .default(0);

          db.rethinkQuery(lastTsInChannelQ)
            .then((ts) => {
              let updateUserQ =
                r.table('users')
                  .get(userId)
                  .update((user) => {
                    return {
                      channels: user('channels').append({
                        id: channel.id,
                        'last_read': ts
                      })
                    }
                  });

              db.rethinkQuery(updateUserQ)
                .then(() => {
                  channel.last_read = ts;

                  let eventQ = r.table('events').insert({
                    user_id: userId,
                    channel: channel,
                    type: 'channel_joined'
                  });

                  db.rethinkQuery(eventQ);

                  return res.status(200).json({ok: true, channel: channel});
                })
                .catch((err) => {
                  return next(err);
                })
            }).catch((err) => {
              return next(err);
            })
        })
        .catch((err) => {
          return next(err);
        })
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/channels.leave', (req, res, next) => {
  let userId = req.userId;
  let channelName = req.body.channel_name;
  let getChannelQ =
    r.table('channels')
      .getAll(channelName, {index: 'name'})
      .nth(0)
      .default(null);

  db.rethinkQuery(getChannelQ)
  .then((channel) => {
    if (channel === null) {
      return res.status(200).json({ok: false, err: 'channel_does_not_exist'});
    }

    if (channel.is_general) {
      return res.status(200).json({ok: false, err: 'cant_leave_general'});
    }

    let updateUserQ =
      r.table('users')
        .get(userId)
        .update((user) => {
          return {
            channels: user('channels').filter((ch) => {
              return ch('id').ne(channel.id)
            })
          }
        });

    db.rethinkQuery(updateUserQ)
      .then(() => {
        let eventQ = r.table('events').insert({
          user_id: userId,
          channel_id: channel.id,
          type: 'channel_left'
        });

        db.rethinkQuery(eventQ);

        return res.status(200).json({ok: true});
      })
      .catch((err) => {
        return next(err);
      })
  })
  .catch((err) => {
    return next(err);
  })
})

module.exports = router;
