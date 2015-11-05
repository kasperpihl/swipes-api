"use strict";

const TEAM_ID = process.env.TEAM_ID;

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');
let Promise = require('bluebird');

let router = express.Router();

router.get('/rtm.start', (req, res, next) => {
  let userId = req.session.userId;

  let meQ = r.table('users').get(userId).without('password');
  let channelsQ =
  r.table('channels')
    .concatMap((channel) => {
      return r.table('users').get(userId)('channels')
        .map((uChannel) => {
      	  return r.branch(
            uChannel('id').eq(channel('id')),
            uChannel.merge({is_member: true}),
            channel.merge({is_member: false})
          )
        }).map((fChannel) => {
          return fChannel.merge(channel)
        })
    })
  let imsQ = r.table('users')
    .get(userId)('channels')
    .filter((channel) => {
      return channel('id').match('^D')
    })
    .eqJoin('id', r.table('channels')).zip().without('user_ids')

  // All the users in the team that are not the current logged user
  let notMeQ =
    r.db('swipes')
    .table('teams')
    .getAll(TEAM_ID)
    .withFields("users")
    .concatMap((x) => {
      return x('users').map((user) => {
        return x.merge({users: user})
      })
      .filter((row) => { return row("users") })
    })
    .eqJoin("users", r.db('swipes').table('users'))
    .zip()
    .without("users", "password")

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(channelsQ),
    db.rethinkQuery(imsQ),
    db.rethinkQuery(notMeQ)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      let rtmResponse = {
        ok: true,
        self: data[0],
        channels: data[1],
        ims: data[2],
        users: data[3]
      }

      res.status(200).json(rtmResponse);
    }).catch(err => {
      return next(err);
    })
})

module.exports = router;
