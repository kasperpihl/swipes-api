"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');

let router = express.Router();

router.post('/stars.list', (req, res, next) => {
  let userId = req.session.userId;
  let listQ = r.table('stars').filter({user_id: userId})

  db.rethinkQuery(listQ)
    .then((stars) => {
      res.status(200).json({ok: true, stars: stars});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/stars.add', (req, res, next) => {
  let userId = req.session.userId;
  let channelId = req.body.channel_id;

  if (channelId) {
    let star = {
      type: 'channel',
      user_id: userId,
      channel_id: channelId
    }

    let checkStarQ = r.table('stars').filter(star).count();
    let addStarQ = r.table('stars').insert(star);

    db.rethinkQuery(checkStarQ)
      .then((count) => {
        if (count === 0) {
          db.rethinkQuery(addStarQ)
            .then(() => {
                res.status(200).json({ok: true});
            }).catch((err) => {
              return next(err);
            });
        } else {
          res.status(200).json({ok: false, error: 'already_starred'});
        }
      }).catch((err) => {
        return next(err);
      });
  } else {
    res.status(200).json({ok: true});
  }
})

router.post('/stars.remove', (req, res, next) => {
  let userId = req.session.userId;
  let channelId = req.body.channel_id;

  if (channelId) {
    let star = {
      type: 'channel',
      user_id: userId,
      channel_id: channelId
    }

    let removeQ = r.table('stars').filter(star).delete();

    db.rethinkQuery(removeQ)
      .then((response) => {
        let deleted = response.deleted;

        if (deleted > 0) {
          res.status(200).json({ok: true});
        } else {
          res.status(200).json({ok: false, error: 'not_starred'});
        }
      }).catch((err) => {
        return next(err);
      });
  } else {
    res.status(200).json({ok: true});
  }
})

module.exports = router;
