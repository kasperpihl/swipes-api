import r from 'rethinkdb';
import db from '../../../db';

const createWebhookReference = (user_id, accountId) => {
  const data = {
    user_id,
    account_id: accountId,
  };

  const q = r.table('asana_webhooks').insert(data);

  return db.rethinkQuery(q);
};
const updateWebhookReference = (webhookId, webhook) => {
  const q = r.table('asana_webhooks').get(webhookId).update({ webhook });

  db.rethinkQuery(q)
    .then(() => {
      console.log('Webhook reference updated!');
    })
    .catch((err) => {
      console.log('Error updating webhook reference', err);
    });
};
const updateWebhookReferenceSecret = (webhookId, secret) => {
  const q = r.table('asana_webhooks').get(webhookId).update({ secret });

  return db.rethinkQuery(q);
};
const getWebhookReference = (webhookId) => {
  const q = r.table('asana_webhooks').get(webhookId);

  return db.rethinkQuery(q);
};
const getWebhooksReferences = (user_id) => {
  const q = r.table('asana_webhooks').getAll(user_id, { index: 'user_id' });

  return db.rethinkQuery(q);
};
const deleteWebhooksRefereces = (user_id) => {
  const q = r.table('asana_webhooks').getAll(user_id, { index: 'user_id' }).delete();

  return db.rethinkQuery(q);
};

export {
  createWebhookReference,
  updateWebhookReference,
  updateWebhookReferenceSecret,
  getWebhookReference,
  getWebhooksReferences,
  deleteWebhooksRefereces,
};
