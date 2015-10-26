"use strict";

const TEAM_ID = process.env.TEAM_ID;

var express = require( 'express' );
var getSlug = require('speakingurl');
var r = require('rethinkdb');
var moment = require('moment');
var validator = require('validator');
var util = require('../util.js');
var db = require('../db.js');
var generateId = util.generateSlackLikeId;

var router = express.Router();

router.post('/chat.send', (req, res, next) => {
  // T_TODO check if there is a channel with that id
  let channelId = req.body.channel_id;
  let user = req.body.user;
  let text = req.body.text;

  if (validator.isNull(channelId)) {
    return res.status(409).json({err: 'The channel id cannot be empty!'});
  }

  if (validator.isNull(user)) {
    return res.status(409).json({err: 'The user id cannot be empty!'});
  }

  if (validator.isNull(text)) {
    return res.status(409).json({err: 'You can\'t send an empty message!'});
  }

  let ts = moment().unix();
  let doc = {
    channel_id: channelId,
    user: user,
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
