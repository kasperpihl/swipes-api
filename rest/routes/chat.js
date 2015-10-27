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
let randomNumber = util.randomNumber;

let router = express.Router();

router.post('/chat.send', (req, res, next) => {
  // T_TODO check if there is a channel with that id
  // T_TODO take user_id from logged in user instead of a parameter (Or validate it)
  let channelId = req.body.channel_id;
  let user_id = req.body.user_id;
  let text = req.body.text;

  if (validator.isNull(channelId)) {
    return res.status(409).json({err: 'The channel id cannot be empty!'});
  }

  if (validator.isNull(user_id)) {
    return res.status(409).json({err: 'The user id cannot be empty!'});
  }

  if (validator.isNull(text)) {
    return res.status(409).json({err: 'You can\'t send an empty message!'});
  }

  let ts = moment().valueOf() + randomNumber(3) + "";
  ts = ts.substring(0,ts.length - 6) + "." + ts.substring(ts.length - 6);
  let doc = {
    channel_id: channelId,
    user_id: user_id,
    text: text,
    ts: ts
  };

  let query = r.table('messages').insert(doc);

  db.rethinkQuery(query)
    .then((results) => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
});

module.exports = router;
