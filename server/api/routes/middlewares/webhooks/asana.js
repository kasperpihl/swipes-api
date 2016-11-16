"use strict";

import crypto from 'crypto';
import {
  updateWebhookReferenceSecret,
  getWebhookReference
} from '../../../services/asana/webhooks_db_utils';
import {
  asanaGetAuthDataByAccountId
} from '../db_utils/webhooks';
import {
  asana
} from '../../../services';

const init = (req, res, next) => {
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
}

const validate = (req, res, next) => {
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

const process = (req, res, next) => {
  const {
    accountId,
    resourceId
  } = res.locals;

  asanaGetAuthDataByAccountId({ accountId })
    .then((accountsAuthData) => {
      accountsAuthData.forEach((accountAuthData) => {
        asana.webhooks(accountAuthData, resourceId, accountId, (err, res) => {
          if (err) {
            console.log('ERROR Processing asana webhook', err);
          }
        });
      })
    })
    .catch((error) => {
      console.log(error);
    })

  return next();
}

export {
  init,
  validate,
  process
}
