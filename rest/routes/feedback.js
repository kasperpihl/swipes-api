"use strict";

const config = require('config');
const express = require( 'express' );
const r = require('rethinkdb');
const Promise = require('bluebird');
const validator = require('validator');
const util = require('../util.js');
const db = require('../db.js');
const SwipesError = require( '../swipes-error' );
const router = express.Router();
router.get('/secret.feedback', (req, res, next) => {
  const getFeedbackQ = r.table('feedback');
  db.rethinkQuery(getFeedbackQ)
  .then((res) => {
      return res.status(200).send(res);
    })
    .catch((e) => {
      return next(e);
    })
});
router.post('/feedback.add', (req, res, next) => {
  const user = req.user;
  const feedback = req.body.feedback;

  if (validator.isNull(feedback)) {
    return next(new SwipesError('Feedback is empty'));
  }

  const feedbackObj = {
    userId: user.id,
    email: user.email,
    name: user.name,
    feedback: feedback
  };

  const insertFeedbackQ = r.table('feedback').insert(feedbackObj);

  db.rethinkQuery(insertFeedbackQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((e) => {
      return next(e);
    })
});

module.exports = router;
