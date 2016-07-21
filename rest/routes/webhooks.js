"use strict";

import config from 'config';
import express from 'express';
import crypto from 'crypto';

const router = express.Router();

/* DROPBOX WEBHOOK */
const dropboxConfig = config.get('dropbox');

const validateDropbox = (req, res, next) => {
  const signature = req.headers['x-dropbox-signature'];
  const payload = req.body.toString();
  const hash =
    crypto.createHmac('sha256', dropboxConfig.appSecret)
      .update(payload)
      .digest('hex');

  if (signature !== hash) {
    return res.status(403).send();
  }

  return next();
}

router.get('/dropbox', (req, res, next) => {
  return res.status(200).send(req.query.challenge);
});

router.post('/dropbox', validateDropbox, (req, res, next) => {
  return res.status(200).send();
});

module.exports = router;
