"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let util = require('../util.js');
let db = require('../db.js');
let Promise = require('bluebird');
let validator = require('validator');

let generateId = util.generateSlackLikeId;
let router = express.Router();

router.post('/mentions.get', (req, res, next) => {
  let mentionId = req.body.mention_id;
  let itemId = req.body.item_id;

  if (validator.isNull(mentionId) && validator.isNull(itemId)) {
    res.status(200).json({
      ok: false,
      err: 'mentionId or itemId is required!'
    });
  }

  let getMentionQ = r.table('mentions');

  if (mentionId) {
    getMentionQ = getMentionQ.get(mentionId);
  } else {
    // T_TODO make it with index on item_id
    getMentionQ = getMentionQ.filter({item_id: itemId});
  }

  db.rethinkQuery(getMentionQ)
    .then((mention) => {
      return res.status(200).json({ok: true, mention: mention});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/mentions.getAllInApp', (req, res, next) => {
  let appId = req.body.app_id;

  if (validator.isNull(appId)) {
    res.status(200).json({
      ok: false,
      err: 'appId is required!'
    });
  }

  let getMentionsInAppQ = r.table('mentions').filter({app_id: appId});

  db.rethinkQuery(getMentionsInAppQ)
    .then((mentions) => {
      return res.status(200).json({ok: true, mentions: mentions});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/mentions.search', (req, res, next) => {
  let title = req.body.title;

  if (validator.isNull(title)) {
    res.status(200).json({
      ok: false,
      err: 'title is required!'
    });
  }

  let searchMentionsQ =
    r.table('mentions')
      .filter({item_info: {
        title: title
      }});

  db.rethinkQuery(searchMentionsQ)
    .then((mentions) => {
      return res.status(200).json({ok: true, mentions: mentions});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/mentions.add', (req, res, next) => {
  let appId = req.body.app_id;
  let itemId = req.body.item_id;
  let itemInfo = req.body.item_info || {};
  let targetAppId = req.body.target_app_id;
  let targetScope = req.body.target_scope;
  let targetItemId = req.body.target_item_id;
  let targetItemInfo = req.body.target_item_info || {};

  if (validator.isNull(appId)) {
    res.status(200).json({
      ok: false,
      err: 'appId is required!'
    });
  }

  if (validator.isNull(itemId)) {
    res.status(200).json({
      ok: false,
      err: 'itemId is required!'
    });
  }

  if (validator.isNull(targetAppId)) {
    res.status(200).json({
      ok: false,
      err: 'targetAppId is required!'
    });
  }

  if (validator.isNull(targetScope)) {
    res.status(200).json({
      ok: false,
      err: 'targetScope is required!'
    });
  }

  if (validator.isNull(targetItemId)) {
    res.status(200).json({
      ok: false,
      err: 'targetItemId is required!'
    });
  }

  // Title should be required?
  // This should be the way to search mentions
  if (!itemInfo.title) {
    itemInfo.title = 'Unknown';
  }

  if (!targetItemInfo.title) {
    targetItemInfo.title = 'Unknown';
  }

  let isMentionedQ = r.table('mentions').filter({app_id: appId, item_id: itemId});
  let link = {
    target_app_id: targetAppId,
    target_scope: targetScope,
    target_item_id: targetItemId,
    target_item_info: targetItemInfo
  };

  db.rethinkQuery(isMentionedQ)
    .then((mentions) => {
      if (mentions.length > 0) {
        let updateMentionQ = r.table('mentions').get(mentions[0].id).update({
          links: r.row('links').append(link)
        })

        return db.rethinkQuery(updateMentionQ);
      } else {
        let mention = {
          id: generateId('M'),
          app_id: appId,
          item_id: itemId,
          item_info: itemInfo,
          links: [link]
        };
        let insertMentionQ = r.table('mentions').insert(mention);

        return db.rethinkQuery(insertMentionQ);
      }
    })
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((e) => {
      return next(e);
    })
});

module.exports = router;
