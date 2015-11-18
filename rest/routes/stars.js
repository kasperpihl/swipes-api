"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let validator = require('validator');
let db = require('../db.js');

let router = express.Router();

router.post('/stars.list', (req, res, next) => {
  let userId = req.userId;
  let listQ = r.table('stars').filter({user_id: userId}).without('id');

  db.rethinkQuery(listQ)
    .then((stars) => {
      res.status(200).json({ok: true, stars: stars});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/stars.add', (req, res, next) => {
  let userId = req.userId;
  let type = req.body.type;
  let id = req.body.id;

  if (validator.isNull(type)) {
    return res.status(200).json({ok: false, err: 'type_is_required'});
  }

  if (validator.isNull(id)) {
    return res.status(200).json({ok: false, err: 'id_is_required'});
  }

  let star = {
    type: type,
    user_id: userId,
    item_id: id
  }

  let checkStarQ = r.table('stars').filter(star).count();
  let addStarQ = r.table('stars').insert(star);
  let updateUserChannelsQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        let obj = {};

        obj[type + 's'] = user(type + 's').map((item) => {
          return r.branch(
            item('id').eq(id),
            item.merge({is_starred: true}),
            item
          )
        });

        return obj;
      })

  db.rethinkQuery(checkStarQ)
    .then((count) => {
      if (count === 0) {
        db.rethinkQuery(r.do(addStarQ, updateUserChannelsQ))
          .then(() => {
              return res.status(200).json({ok: true});
          }).catch((err) => {
            return next(err);
          });
      } else {
        return res.status(200).json({ok: false, error: 'already_starred'});
      }
    }).catch((err) => {
      return next(err);
    });
})

router.post('/stars.remove', (req, res, next) => {
  let userId = req.userId;
  let type = req.body.type;
  let id = req.body.id;

  if (validator.isNull(type)) {
    return res.status(200).json({ok: false, err: 'type_is_required'});
  }

  if (validator.isNull(id)) {
    return res.status(200).json({ok: false, err: 'id_is_required'});
  }

  let star = {
    type: type,
    user_id: userId,
    item_id: id
  }

  let removeQ = r.table('stars').filter(star).delete();
  let updateUserChannelsQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        let obj = {};

        obj[type + 's'] = user(type + 's').map((item) => {
          return r.branch(
            item('id').eq(id),
            item.without('is_starred'),
            item
          )
        });

        return obj;
      })

  db.rethinkQuery(removeQ)
    .then((response) => {
      let deleted = response.deleted;

      if (deleted > 0) {
        db.rethinkQuery(updateUserChannelsQ);

        res.status(200).json({ok: true});
      } else {
        res.status(200).json({ok: false, error: 'not_starred'});
      }
    }).catch((err) => {
      return next(err);
    });
})

module.exports = router;
