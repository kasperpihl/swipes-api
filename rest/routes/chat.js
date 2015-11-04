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

  insertMessage(res, next, doc);
});

module.exports = router;
