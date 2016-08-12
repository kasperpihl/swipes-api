"use strict";

import config from 'config';
import express from 'express';
import crypto from 'crypto';
import {
  processWebhookMessage
} from '../middlewares/process_webhook';
import {
  updateWebhookReferenceSecret,
  getWebhookReference
} from '../utils/asana_webhook_util';

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

/* ASANA WEBHOOK */
const validateAsana = (req, res, next) => {
  // T_TODO validation required
  const message = req.body.toString();
  const signature = req.headers['x-hook-signature'];
  const webhookId = res.locals.webhookId;

  getWebhookReference(webhookId)
    .then((result) => {
      if (result === null) {
        throw 'We unsubscribed already. Theese are some old events.'
      }

      const secret = result.secret;

      const hash =
        crypto.createHmac('sha256', secret)
          .update(message)
          .digest('hex');

      if (signature !== hash) {
        return res.status(403).send();
      }

      res.locals.service = 'asana';
      res.locals.resourceId = result.webhook.resource.id;
      res.locals.accountId = result.account_id;
      res.locals.message = JSON.parse(message);

      return next();
    })
    .catch((err) => {
      console.log('Failing getting the webhook reference', err);
      return res.status(403).send();
    })
}

const asanaHookInit = (req, res, next) => {
  const secret = req.headers['x-hook-secret'];
  const pathParts = req.path.split('/');
  const webhookId = pathParts[2];

  if (secret) {
    updateWebhookReferenceSecret(webhookId, secret)
      .then(() => {
        res.setHeader("X-Hook-Secret", secret);
        return res.status(200).send();
      })
      .catch((err) => {
        console.log('Failed updating the webhook secret', err);
        return res.status(400).send();
      })
  } else {
    res.locals.webhookId = webhookId;

    return next();
  }
};

router.post('/asana/*', asanaHookInit, validateAsana, processWebhookMessage, (req, res, next) => {
  return res.status(200).send();
});

module.exports = router;
