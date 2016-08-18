"use strict";

import r from 'rethinkdb';
import Promise from 'bluebird';
import db from '../db.js'; // T_TODO I should make this one a local npm module
import SwipesError from '../swipes-error.js';

const createWebhookReference = (userId, accountId) => {
  const data = {
    user_id: userId,
    account_id: accountId
  }

  const insertQ = r.table('asana_webhooks').insert(data);

  return db.rethinkQuery(insertQ);
}

const updateWebhookReference = (webhookId, webhook) => {
  const updateQ = r.table('asana_webhooks').get(webhookId).update({ webhook });

  db.rethinkQuery(updateQ)
    .then(() => {
      console.log('Webhook reference updated!');
    })
    .catch((err) => {
      console.log('Error updating webhook reference', err);
    });
}

const updateWebhookReferenceSecret = (webhookId, secret) => {
  const updateQ = r.table('asana_webhooks').get(webhookId).update({ secret });

  return db.rethinkQuery(updateQ);
}

const getWebhookReference = (webhookId) => {
  const getQ = r.table('asana_webhooks').get(webhookId);

  return db.rethinkQuery(getQ);
}

const getWebhooksReferences = (userId) => {
  const query = r.table('asana_webhooks').getAll(userId, {index: 'user_id'});

  return db.rethinkQuery(query);
}

const deleteWebhooksRefereces = (userId) => {
  const deleteQ = r.table('asana_webhooks').getAll(userId, {index: 'user_id'}).delete();

  return db.rethinkQuery(deleteQ);
}

export {
  createWebhookReference,
  updateWebhookReference,
  updateWebhookReferenceSecret,
  getWebhookReference,
  getWebhooksReferences,
  deleteWebhooksRefereces
}
