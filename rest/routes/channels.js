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

  let findChannelIndexQ =
    r.table("users")
      .get(userId)("channels")
      .offsetsOf(
        r.row("id").match(channelId)
      )
      .nth(0)

  let updateQ =
    findChannelIndexQ.do((index) => {
      return r.table('users')
        .get(userId)
        .update((user) => {
          return {
            channels: user('channels').changeAt(index,
              user("channels")
                .nth(index)
                .merge({"last_read": ts})
            )
          }
        })
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
      .orderBy('ts');

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

module.exports = router;
