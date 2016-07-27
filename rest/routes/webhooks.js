"use strict";

import config from 'config';
import express from 'express';
import crypto from 'crypto';
import { processWebhookMessage } from '../middlewares/process_webhook';

const router = express.Router();

/* DROPBOX WEBHOOK */
const dropboxConfig = config.get('dropbox');

const validateDropbox = (req, res, next) => {
  const signature = req.headers['x-dropbox-signature'];
  const message = req.body.toString();
  const hash =
    crypto.createHmac('sha256', dropboxConfig.appSecret)
      .update(message)
      .digest('hex');

  if (signature !== hash) {
    return res.status(403).send();
  }

  res.locals.service = 'dropbox';
  res.locals.message = JSON.parse(message);

  return next();
}

router.get('/dropbox', (req, res, next) => {
  return res.status(200).send(req.query.challenge);
});

router.post('/dropbox', validateDropbox, processWebhookMessage, (req, res, next) => {
  return res.status(200).send();
});

module.exports = router;
